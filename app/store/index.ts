import { configureStore } from '@reduxjs/toolkit';
import actionBouncer from './actionBouncer.middle';
import droppedCardsReducer from './droppedCards.slice';
import myCardsReducer from './myCards.slice';
import playersReducer from './players.slice';

export const store = configureStore({
  reducer: {
    myCards: myCardsReducer,
    droppedCards: droppedCardsReducer,
    players: playersReducer,
  },
  // middleware: defaultMiddlewares => defaultMiddlewares().concat([actionBouncer]),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;