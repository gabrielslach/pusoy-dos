import { Card } from "../store/types";

enum familyEnum {
    'Clubs',
    'Spades',
    'Hearts',
    'Diamonds',
}

type combinationValidatorCB = (selectedCards: Card[]) => boolean;

const valuesEnum: {[key: number | string]: number} = {
    3: 0,
    4: 1,
    5: 2,
    6: 3,
    7: 4,
    8: 5,
    9: 6,
    10: 7,
    'J': 8,
    'Q': 9,
    'K': 10,
    'A': 11,
    2: 12
}

const getHighestCard = (cards: Card[]) => {
    let highestCard: Card = cards[0];
    for (const card of cards) {
        if (
            valuesEnum[card.value] >= valuesEnum[highestCard.value] &&
            familyEnum[card.family] >= familyEnum[highestCard.family]
            )
        {
            highestCard = card;
        }
    }

    return highestCard;
}

const areSelectedCardsHigher = (droppedCards: Card[], selectedCards: Card[]) => {
    const { family: dFamily, value: dValue } = getHighestCard(droppedCards);
    const { family: sFamily, value: sValue } = getHighestCard(selectedCards);

    if (valuesEnum[sValue] < valuesEnum[dValue]) {
        return false;
    }

    if (valuesEnum[sValue] === valuesEnum[dValue]) {
        if (familyEnum[sFamily] < familyEnum[dFamily]) {
            return false;
        }
    }

    return true;
}

const areIdenticalValues = (cards: Card[]) => {
    let isValid = true;
    let prevCard: Card = cards[0];

    for (const card of cards) {
        if (
            card.value !== prevCard.value
        ) 
        {
            isValid = false;
            break;
        }
    }

    return isValid;
}

const hasLength = (value: number) => (array: any[]) => array.length === value;

const filterSameFamily = (baseIndex: number) => (cards: Card[]) => {
    const family = cards[baseIndex].family
    return cards.filter(c => c.family === family);
}

const filterSameValue = (baseIndex: number) => (cards: Card[]) => {
    const value = cards[baseIndex].value
    return cards.filter(c => c.value === value);
}

const areValuesConsecutive = (cards: Card[]) => {
    const _cards = [...cards];
    _cards.sort((a, b) => valuesEnum[a.value] - valuesEnum[b.value]);
    let prevValue: number = 0;
    for (const card of _cards) {
        if (valuesEnum[card.value] <= prevValue) {
            return false;
        }
        prevValue = valuesEnum[card.value];
    }

    return true;
}

const sortByValue = (cards: Card[]) => [...cards].sort((a, b) => valuesEnum[a.value] - valuesEnum[b.value]);

const splitCardsByValue = (cards: Card[]) => {
    const sortedCards = sortByValue(cards);
    const lastValIndex = cards.length - 1;
    
    const leftPart = filterSameValue(0)(sortedCards);
    const rightPart = filterSameValue(lastValIndex)(sortedCards);

    return { leftPart, rightPart };
}

const getPartWith = (noOfItems: number) => <T>(objOfArr: { leftPart: T[], rightPart: T[]}) => {
    if (objOfArr.leftPart.length === noOfItems) return objOfArr.leftPart;
    if (objOfArr.rightPart.length === noOfItems) return objOfArr.rightPart;

    return [];
}

const isStraight = (cards: Card[]) => areValuesConsecutive(cards);

const isFlush = (cards: Card[]) => filterSameFamily(0)(cards).length === 5;

const isFullHouse = (cards: Card[]) => {
    const { leftPart, rightPart } = splitCardsByValue(cards);

    if (JSON.stringify(leftPart[0]) === JSON.stringify(rightPart[0])) {
        return false;
    }

    if (leftPart.length !== 3 && leftPart.length !== 2) {
        return false;
    }

    if (rightPart.length !== 3 && rightPart.length !== 2) {
        return false;
    }

    return true;
};

const isQuadra = (cards: Card[]) => {
    const { leftPart, rightPart } = splitCardsByValue(cards);

    if (JSON.stringify(leftPart[0]) === JSON.stringify(rightPart[0])) {
        return false;
    }

    if (leftPart.length !== 4 && leftPart.length !== 1) {
        return false;
    }

    if (rightPart.length !== 4 && rightPart.length !== 1) {
        return false;
    }

    return true;
};

const isStraightFlush = (cards: Card[]) => isFlush(cards) && isStraight(cards);

const checkSelectedCardsValidity = (droppedCards: Card[]): combinationValidatorCB => {
    switch (droppedCards.length) {
        case 1:
            return (selectedCards) => {
                return (
                    hasLength(1)(selectedCards) && 
                    areSelectedCardsHigher(droppedCards, selectedCards)
                    );
            }
            
        case 2:
            return (selectedCards) => {
                return (
                    hasLength(2)(selectedCards) &&
                    areIdenticalValues(selectedCards) &&
                    areSelectedCardsHigher(droppedCards, selectedCards)
                    );
            }
            
        case 3:
            return (selectedCards) => {
                return (
                    hasLength(3)(selectedCards) &&
                    areIdenticalValues(selectedCards) &&
                    areSelectedCardsHigher(droppedCards, selectedCards)
                    );
            }
            
        case 5:
            if (isStraight(droppedCards)) return (selectedCards) => {
                return (
                    hasLength(5)(selectedCards) &&
                    isStraight(selectedCards) &&
                    areSelectedCardsHigher(droppedCards, selectedCards)
                    );
            }
            if (isFlush(droppedCards)) return (selectedCards) => {
                return (
                    hasLength(5)(selectedCards) && 
                    isFlush(selectedCards) && 
                    areSelectedCardsHigher(droppedCards, selectedCards)
                    );
            }
            if (isFullHouse(droppedCards)) return (selectedCards) => {
                return (
                    hasLength(5)(selectedCards) && 
                    isFullHouse(selectedCards) && 
                    areSelectedCardsHigher(
                        getPartWith(3)(splitCardsByValue(droppedCards)), 
                        getPartWith(3)(splitCardsByValue(selectedCards))
                        )
                    );
            }
            if (isQuadra(droppedCards)) return (selectedCards) => {
                return (
                    hasLength(5)(selectedCards) &&
                    isQuadra(selectedCards) &&
                    areSelectedCardsHigher(
                        getPartWith(4)(splitCardsByValue(droppedCards)),
                        getPartWith(4)(splitCardsByValue(selectedCards))
                        )
                    );
            }
            if (isStraightFlush(droppedCards)) return (selectedCards) => {
                return (
                    hasLength(5)(selectedCards) && 
                    isStraightFlush(selectedCards) && 
                    areSelectedCardsHigher(droppedCards, selectedCards)
                    );
            }

            return () => false;

        default:
            return () => false;
    }
};

export default checkSelectedCardsValidity;