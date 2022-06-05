export interface Card {
    value: number | string;
    family: string
}

export type CardState = {
    cards: Card[];
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: any;
}

export interface Player {
    name: string,
    id: number
}

export type FetchRoomResponse = { 
    myDeck: Card[];
    playerTurn: number;
    myPlayerNumber: number;
    players: string[]
}