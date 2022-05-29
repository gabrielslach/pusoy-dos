import React, {useEffect, useRef} from 'react';
import { useDispatch } from 'react-redux';

type useWebhookParams = {
    roomID: string,
    playerID: string
}

const socketFactory = (roomID: string, playerID: string) => new WebSocket(`${process.env.NEXT_PUBLIC_WS_URI}/play/${roomID}/${playerID}`);

const useWebhook = ({ roomID, playerID }: useWebhookParams) => {
    const socket = useRef<WebSocket>();

    const dispatch = useDispatch();

    useEffect(()=> {
        socket.current = socketFactory(roomID, playerID);
    }, [playerID, roomID]);

    const sendData = (payload: string) => {
        socket.current?.send(payload);
    };

    const closeSocket = () => {
        socket.current?.close();
    }

    const reconnectSocket = () => {
        socket.current = socketFactory(roomID, playerID);
    }

    socket.current?.addEventListener('open', (e) => {
        console.log('opened', e);
    });

    socket.current?.addEventListener('message', (e) => {
        const data = JSON.parse(e.data);

        if (data && !data.type && data.type === 'ERROR') {
            return;
        }

        switch (data.type) {
            case 'PUBLIC':
                //dispatch dropped cards
                //disptch next turn
                break;

            case 'PRIVATE':
                //dispatch my cards
                break;

            case 'INFO':
                //dispatch players info
                break;
        
            default:
                break;
        }
    });
    
    socket.current?.addEventListener('close', (e) => {
        console.log('close: ', e);
    });
    
    socket.current?.addEventListener('error', (e) => {
        console.log('error: ', e);
    });

    return {
        sendData,
        closeSocket,
        reconnectSocket,
    }
}

export default useWebhook;