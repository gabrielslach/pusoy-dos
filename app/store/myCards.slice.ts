import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Card } from "./types";

const myCardsSlice = createSlice({
    name: 'myCards',
    initialState: [] as Card[],
    reducers: {
        dropCards(state: Card[], action: PayloadAction<Card[]>) {
            const pickedCards = action.payload;
            return state.filter(card => !pickedCards.find(p => p.family === card.family && p.value === card.value));
        },
        myCardsFetched(state: Card[], action: PayloadAction<Card[]>) {
            state = action.payload;
            return state;
        }
    }
});

export const { dropCards, myCardsFetched } = myCardsSlice.actions;
export default myCardsSlice.reducer;
