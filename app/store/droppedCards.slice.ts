import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Card } from "./types";

const droppedCardsSlice = createSlice({
    name: 'droppedCards',
    initialState: [] as Card[],
    reducers: {
        setDroppedCards(state: Card[], action: PayloadAction<Card[]>) {
            return action.payload;
        },
    }
});

export const { setDroppedCards } = droppedCardsSlice.actions;
export default droppedCardsSlice.reducer;
