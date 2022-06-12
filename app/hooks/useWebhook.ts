import React, {useEffect, useRef, useState} from 'react';
import { useDispatch } from 'react-redux';
import { setDroppedCards } from '../store/droppedCards.slice';
import { myCardsFetched } from '../store/myCards.slice';
import { setPlayerTurn } from '../store/players.slice';

type useWebhookParams = {
    roomID: string;
    playerID: string;
}

type WebSocketForHeartbeat = WebSocket & {
    pingTimeout: NodeJS.Timer;
}

const createSocket = (roomID: string, playerID: string) => new WebSocket(`${process.env.NEXT_PUBLIC_WS_URI}/play/${roomID}/${playerID}`);

function heartbeat (this: WebSocketForHeartbeat) {
    clearTimeout(this.pingTimeout);
    this.pingTimeout = setInterval(() => {
        this.close();
    }, 30000 + 1000);
}

const useWebhook = ({ roomID, playerID }: useWebhookParams) => {
    const socket = useRef<WebSocket>();
    const [playersOnline, setPlayersOnline] = useState<Set<number>>(new Set());
    const [playersCardsCount, setPlayersCardsCount] = useState<{[key: number]: number}>({});

    const dispatch = useDispatch();

    useEffect(()=> {
        if (!(roomID || playerID)) {
            return;
        }
        socket.current = createSocket(roomID, playerID);

        return closeSocket;
    }, [playerID, roomID]);

    const sendData = (payload: string) => {
        socket.current?.send(payload);
    };

    const closeSocket = () => {
        socket.current?.close();
    }

    const reconnectSocket = () => {
        socket.current = createSocket(roomID, playerID);
    }

    socket.current?.addEventListener('open', heartbeat);

    socket.current?.addEventListener('ping', heartbeat);

    socket.current?.addEventListener('message', (e) => {
        const data = JSON.parse(e.data);

        if (data && !data.type && data.type === 'ERROR') {
            return;
        }

        switch (data.type) {
            case 'NEXT_TURN':
                const { nextPlayerIndex, droppedCards, playersCardsCount, error } = data;
                if (error) {
                    return;
                }
                if (droppedCards.length > 0){
                    dispatch(setDroppedCards(droppedCards));
                }
                dispatch(setPlayerTurn(nextPlayerIndex));
                setPlayersCardsCount(playersCardsCount);
                break;

            case 'DECK_UPDATE':
                const { myDeck } = data;
                dispatch(myCardsFetched(myDeck));
                break;

            case 'PLAYERS_INFO':
                const { playersOnline: _playersOnline } = data;
                if (typeof _playersOnline.length !== 'number') {
                    return;
                }
                const _playersOnlineSet = new Set<number>();
                _playersOnline.forEach((p: number) => _playersOnlineSet.add(p));
                setPlayersOnline(_playersOnlineSet);
                break;
        
            default:
                break;
        }
    });
    
    socket.current?.addEventListener('close', function(this: WebSocketForHeartbeat) {
        clearTimeout(this.pingTimeout);
        console.log('connection closed.')
    });
    
    socket.current?.addEventListener('error', function(this: WebSocketForHeartbeat) {
        clearTimeout(this.pingTimeout);
        console.log('socket error.')
    });

    return {
        sendData,
        closeSocket,
        reconnectSocket,
        playersOnline,
        playersCardsCount,
    }
}

export default useWebhook;