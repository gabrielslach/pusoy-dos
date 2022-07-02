import { Box, Grid, Typography } from "@mui/material";
import { blueGrey, green, yellow } from "@mui/material/colors";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import MainCard from "./Card";
import FunctionalAvatar from "./FunctionalAvatar";

interface GameTableProps {
    isMyTurn: boolean,
    playersOnline: Set<number>,
    playersCardsCount: {[key: number]: number}
    roomID: string,
    myName: string,
}

const GameTable = (props: GameTableProps) => {
  const players = useSelector((state: RootState) => state.players);
  const droppedCards = useSelector((state: RootState) => state.droppedCards);
    return (
    <>
        <Box sx={theme => ({backgroundColor: props.isMyTurn ? green[900]: blueGrey[800], padding: theme.spacing(2), paddingBottom: theme.spacing(4)})}>
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
                    {players.players.map((p) => (
                    <Grid item key={`player-${p.id}`}>
                        <FunctionalAvatar
                        isOnline={props.playersOnline.has(p.id) || p.id === players.myPlayerNumber} 
                        name={p.name}
                        cardCount={props.playersCardsCount[p.id]}
                        sx={(players.playerTurn === p.id) ? {backgroundColor: yellow[500], color: "black"}: {} } 
                        />
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
        <Box sx={theme => ({backgroundColor: props.isMyTurn ? green[900]: blueGrey[800], padding: theme.spacing(2), paddingTop: 0, paddingBottom: theme.spacing(3)})}>
        <Typography variant="caption" color="white" >ROOM ID: { props.roomID } | PLAYER: { props.myName }</Typography>
        </Box>
    </>
    )
}

export default GameTable;