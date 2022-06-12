import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Card, CardState, FetchRoomResponse } from "./types";
import constructURI from "../../app/utils/constructURI";

export const fetchRoom = createAsyncThunk(
    'myCards/fetchRoom',
    async (payload: {roomID: string, playerID: string}, { rejectWithValue }) => {
        try {
            const res = await fetch(constructURI('my-room', payload.roomID, payload.playerID));
            const roomDetails: FetchRoomResponse = await res.json();
            if (!roomDetails) {
                return rejectWithValue('No payload');
            }
            
            return roomDetails;
        } catch (err: any) {
            return rejectWithValue(err.response.data)
        }
    }
)

const myCardsSlice = createSlice({
    name: 'myCards',
    initialState: {
        cards: [],
        loading: 'idle',
        error: null
    } as CardState,
    reducers: {
        dropCards(state: CardState, action: PayloadAction<Card[]>) {
            const pickedCards = action.payload;
            state.cards = state.cards.filter(card => !pickedCards.find(p => p.family === card.family && p.value === card.value));

            return state;
        },
        myCardsFetched(state: CardState, action: PayloadAction<Card[]>) {
            state.cards = action.payload.map(
                ({family, value}) => ({family, value})
                );

            return state;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoom.fulfilled, (state, action) => {
                const { myDeck, playerTurn } = action.payload;
                if (!myDeck) {
                    return state;
                }
                state.cards = myDeck;
                return state;
            })
    }
});

export const { dropCards, myCardsFetched } = myCardsSlice.actions;
export default myCardsSlice.reducer;
