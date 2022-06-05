import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Avatar, Box, Button, Grid, Typography } from '@mui/material';
import { blueGrey, green, yellow } from '@mui/material/colors';
import MainCard from '../../../components/Card';

import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../../app/store';
import { fetchRoom } from '../../../app/store/myCards.slice';
import { Card, Player } from '../../../app/store/types';
import { playersFetched, setPlayerTurn } from '../../../app/store/players.slice';
import useWebhook from '../../../app/hooks/useWebhook';

function* setNextTurn(players: Player[]) {
  let i = 0;
  const playersLen = players.length;
  while (true) {
    yield players[i].id;

    i++;

    if (i === playersLen) {
      i = 0;
    }
  }
}

const Play: NextPage = () => {
  const myCards = useSelector((state: RootState) => state.myCards.cards);
  const droppedCards = useSelector((state: RootState) => state.droppedCards);
  const players = useSelector((state: RootState) => state.players);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { roomID, playerID } = router.query as { roomID: string, playerID: string};

  const [selected, setSelected] = useState<Card[]>([]);

  const { sendData } = useWebhook({roomID, playerID});

  const handleDropCards = (cards: Card[]) => {
    sendData(JSON.stringify({
      action: "DROP_CARD",
      payload: cards
    }))
  };

  const handleCardSelect = (cardID: number) => {
    if (isSelected(myCards[cardID])) {
      const card = myCards[cardID];
      return setSelected(selected.filter(s => s.value !== card.value || s.family !== card.family));
    }
    setSelected([...selected, myCards[cardID]]);
  }

  const isSelected = (card: Card) => {
    return selected.findIndex(s => s.value === card.value && s.family === card.family) > -1;
  }

  const setupRoom = useCallback(async () => {
    const room = await dispatch(fetchRoom({roomID, playerID})).unwrap();
    dispatch(playersFetched(room.players.map((s, index) => ({name: s, id: index}))));
    dispatch(setPlayerTurn(room.playerTurn));
  }, [dispatch, playerID, roomID]);

  useEffect(() => {
    if (!(roomID && playerID)) {
      return;
    }

    setupRoom();
  }, [roomID, playerID, setupRoom]);

  return (
    <>
    <Head>
      <title>Play Pusoy Dos</title>
      <meta name="description" content="Play Pusoy Dos by GSLACH" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Box sx={theme => ({backgroundColor: green[900], padding: theme.spacing(2), paddingBottom: theme.spacing(6)})}>
      <Grid
        container
        className="app"
        direction="column"
        spacing={4}
      >
        <Grid item>
          <Grid 
            container 
            direction="row" 
            spacing={2}
            alignItems="center"
          >
          <Grid item>
            <Typography variant="h6" color="white">Turn:</Typography>
          </Grid>
            {players.players.map(p => (
              <Grid item key={`player-${p.id}`}>
                <Avatar sx={ players.playerTurn === p.id ? {backgroundColor: yellow[500], color: "black"}: {}}>{p.name}</Avatar>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item>
          <Grid
            container
            direction="row"
            spacing={1}
            alignItems="stretch"
            justifyContent="center"
            sx={theme => ({height: theme.spacing(16)})}
            id="board"
          >
            {droppedCards.map(i => (
            <Grid item key={`board-card-${i.value}-${i.family}`}>
              <MainCard number={i.value} family={i.family}/>
            </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
      {/* Button Controls */}
      <Grid
        container
        className="app"
        direction="column"
        spacing={2}
        sx={{backgroundColor: blueGrey[900]}}
      >
        <Grid item>
          <Grid container direction="row" spacing={2} padding={2}>
            <Grid item xs={8}>
              <Button
                variant="contained"
                color="success"
                onClick={()=>handleDropCards(selected)}
                fullWidth
                >
                Drop Cards
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" color="secondary" fullWidth>
                Pass
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {/* Player Cards */}
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