import { Button, Grid } from "@mui/material";
import { Card } from "../app/store/types";

interface TurnActionButtonsProps {
    sendData: (payload: string) => void,
    isMyTurn: boolean,
    isDropAllowed: boolean,
    selectedCards: Card[],
}
const TurnActionButtons = (props: TurnActionButtonsProps) => {
    const handleDropCards = (cards: Card[]) => {
        props.sendData(JSON.stringify({
        action: "DROP_CARD",
        payload: cards
        }));
    };

    const handlePass = () => {
        props.sendData(JSON.stringify({
        action: "PASS"
        }));
    };

    return(
        <Grid container direction="row" spacing={2} padding={2} paddingTop={2} >
            <Grid item xs={8}>
            <Button
                variant="contained"
                color="success"
                onClick={()=>handleDropCards(props.selectedCards)}
                disabled={!props.isMyTurn || !props.isDropAllowed}
                fullWidth
                >
                Drop Cards
            </Button>
            </Grid>
            <Grid item xs={4}>
            <Button
                variant="contained"
                color="secondary"
                onClick={()=>handlePass()}
                disabled={!props.isMyTurn}
                fullWidth>
                Pass
            </Button>
            </Grid>
        </Grid>
    )
}

export default TurnActionButtons;