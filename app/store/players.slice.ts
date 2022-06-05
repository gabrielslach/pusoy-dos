import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "./types";

const playersSlice = createSlice({
    name: 'players',
    initialState: {
        players: [] as Player[],
        playerTurn: 0
    },
    reducers: {
        setPlayerTurn(state: any, action: PayloadAction<number>) {
            state.playerTurn = action.payload;
            return state;
        },
        playersFetched(state: any, action: PayloadAction<Player[]>) {
            state.players = action.payload;
            return state;
        }
    }
});

export const { setPlayerTurn, playersFetched } = playersSlice.actions;
export default playersSlice.reducer;
