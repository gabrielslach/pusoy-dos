import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import { Button, Container, Grid, TextField } from '@mui/material'

const Home: NextPage = () => {
  return (
    <Container>
      <Grid
        container
        alignItems="stretch"
        direction="column"
        spacing={2}
        textAlign="center"
        color="white"
        >
        <Head>
          <title>Play Pusoy Dos</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Grid item>
          <h2>Play Pusoy Dos!</h2>
        </Grid>
        <Grid item>
          <Button variant="contained" fullWidth >Create a room</Button>
        </Grid>
        <Grid item>
          <p>or</p>
        </Grid>
        <Grid item>
          <TextField fullWidth variant="filled" />
        </Grid>
        <Grid item>
          <Button variant="contained" fullWidth >Join room</Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Home
