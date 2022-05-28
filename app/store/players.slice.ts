import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Player {
    name: string,
    id: string
}

const playersSlice = createSlice({
    name: 'players',
    initialState: {
        players: [] as Player[],
        playerTurn: '1'
    },
    reducers: {
        setPlayerTurn(state: any, action: PayloadAction<string>) {
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
