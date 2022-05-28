import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Card } from "./types";

const droppedCardsSlice = createSlice({
    name: 'droppedCards',
    initialState: [] as Card[],
    reducers: {
        temp_setDroppedCards(state: Card[], action: PayloadAction<Card[]>) {
            return action.payload;
        },
        droppedCardsFetched(state: Card[], action: PayloadAction<Card[]>) {
            state = action.payload;
            return state;
        }
    }
});

export const { temp_setDroppedCards, droppedCardsFetched } = droppedCardsSlice.actions;
export default droppedCardsSlice.reducer;
