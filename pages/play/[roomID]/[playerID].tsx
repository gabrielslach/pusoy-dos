import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Box, Button, Grid } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import MainCard from '../../../components/Card';

import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../../app/store';
import { fetchRoom, swapCards } from '../../../app/store/myCards.slice';
import { Card, FetchRoomResponse } from '../../../app/store/types';
import { playersFetched, setLastDropBy, setMyPlayerNumber, setPlayerTurn } from '../../../app/store/players.slice';
import useWebSocket from '../../../app/hooks/useWebSocket';
import usePrevious from '../../../app/hooks/usePrevious';
import { setDroppedCards } from '../../../app/store/droppedCards.slice';
import checkSelectedCardsValidity, { haveThreeClubs } from '../../../app/utils/gameRules';
import TurnActionButtons from '../../../components/TurnActionButtons';
import GameTable from '../../../components/GameTable';

enum cardDeckModes {
  turn,
  swap
}

const Play: NextPage = () => {
  const myCards = useSelector((state: RootState) => state.myCards.cards);
  const droppedCards = useSelector((state: RootState) => state.droppedCards);
  const players = useSelector((state: RootState) => state.players);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { roomID, playerID } = router.query as { roomID: string, playerID: string};

  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [myName, setMyName] = useState('');
  const [cardDeckMode, setCardDeckMode] = useState<cardDeckModes>(cardDeckModes.turn);

  const { sendData, playersOnline, playersCardsCount } = useWebSocket({roomID, playerID});
  const prevPlayersOnline = usePrevious(playersOnline);

  const isDropAllowed = useMemo(() => {
    const isFreeTurn = players.lastDropBy === players.myPlayerNumber;
    
    if (isFreeTurn && droppedCards.length === 0) {
      if (!haveThreeClubs(selectedCards)) {
        return false;
      }
    }

    if (cardDeckMode !== cardDeckModes.turn) {
      return false;
    }

    return checkSelectedCardsValidity(isFreeTurn ? selectedCards : droppedCards, isFreeTurn)(selectedCards);
  }, [
    droppedCards, 
    selectedCards, 
    players.lastDropBy, 
    players.myPlayerNumber, 
    cardDeckMode
  ]);

  const isMyTurn = useMemo(() => {
    return players.myPlayerNumber === players.playerTurn;
  }, [players.myPlayerNumber, players.playerTurn]);

  const cardDeckModeSwitchLabel = useMemo(() => {
    return cardDeckMode === cardDeckModes.turn ? "Swap Cards" : "Select Cards to Drop"
  }, [cardDeckMode]);

  const isSelected = useCallback((card: Card) => {
    return selectedCards.findIndex(s => s.value === card.value && s.family === card.family) > -1;
  }, [selectedCards]);

  const handleCardSelect = (cardID: number) => {
    if (isSelected(myCards[cardID])) {
      const card = myCards[cardID];
      return setSelectedCards(selectedCards.filter(s => s.value !== card.value || s.family !== card.family));
    }
    setSelectedCards([...selectedCards, myCards[cardID]]);
  }

  const toggleCardDeckMode = () => {
    setSelectedCards([]);

    let mode: cardDeckModes;
    switch (cardDeckMode) {
      case cardDeckModes.swap:
        mode = cardDeckModes.turn;
        break;
      
      case cardDeckModes.turn:
      default:
        mode = cardDeckModes.swap;
        break;
    }

    setCardDeckMode(mode);
  }

  const handleSwapCards = (selectedCards: Card[]) => {
    const [insertIndex, deleteIndex] = selectedCards
      .map(s => myCards.findIndex(m => s.family === m.family && s.value === m.value))
      .sort();
    dispatch(swapCards({ insertIndex, deleteIndex }));
    setSelectedCards([]);
  }

  const setupRoom = useCallback(async () => {
    const room: FetchRoomResponse = await dispatch(fetchRoom({roomID, playerID})).unwrap();
    dispatch(playersFetched(room.players.map((s, index) => ({name: s, id: index}))));
    dispatch(setPlayerTurn(room.playerTurn));
    dispatch(setMyPlayerNumber(room.myPlayerNumber));
    dispatch(setDroppedCards(room.droppedCards));
    dispatch(setLastDropBy(room.lastDropBy));
  }, [dispatch, playerID, roomID]);

  useEffect(() => {
    if (cardDeckMode !== cardDeckModes.swap) {
      return;
    }

    if (selectedCards.length !== 2) {
      return;
    }

    handleSwapCards(selectedCards);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selectedCards)]);

  useEffect(() => {
    setSelectedCards([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(myCards)]);

  useEffect(() => {
    if (players.players.length === 4) {
      return;
    }
    if (prevPlayersOnline && playersOnline.size === prevPlayersOnline.size) {
      return;
    }
    if (!(roomID && playerID)) {
      return;
    }
    setupRoom();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playersOnline, prevPlayersOnline]);

  useEffect(() => {
    if (players.myPlayerNumber < 0) {
      return;
    }
    if (myName) {
      return;
    }
    setMyName(players.players[players.myPlayerNumber].name)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);

  useEffect(() => {
    if (!(roomID && playerID)) {
      return;
    }

    setupRoom();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomID, playerID]);

  return (
    <>
    <Head>
      <title>Play Pusoy Dos</title>
      <meta name="description" content="Play Pusoy Dos by GSLACH" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <GameTable
      isMyTurn={isMyTurn}
      playersOnline={playersOnline}
      playersCardsCount={playersCardsCount}
      roomID={roomID}
      myName={myName}
      />
    <Grid
      container
      className="app"
      direction="column"
      spacing={2}
      sx={{backgroundColor: blueGrey[900]}}
    >
      <Grid item>
        <TurnActionButtons
          sendData={sendData}
          isMyTurn={isMyTurn}
          isDropAllowed={isDropAllowed}
          selectedCards={selectedCards}
          />
      </Grid>
      <Grid item>
        <Box paddingLeft={2} paddingRight={2}>
          <Button
            variant="contained"
            onClick={() => toggleCardDeckMode()}
            fullWidth
          >
              {cardDeckModeSwitchLabel}
          </Button>
        </Box>
      </Grid>
      <Grid item>
        <Grid container direction="row" spacing={2} justifyContent="center" sx={theme => ({padding: theme.spacing(1)})}>
          {myCards.map((card, idx) => (
            <Grid item key={`player-deck-${idx}`}>
              <MainCard
                number={card.value}
                family={card.family}
                isSelected={isSelected(card)}
                onClick={() => handleCardSelect(idx)}
                />
          </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
    </>
  );
}

export default Play;