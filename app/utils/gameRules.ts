import { Card } from "../store/types";

enum familyEnum {
    'Clubs',
    'Spades',
    'Hearts',
    'Diamonds',
}

enum fiveCardsCombinationEnum {
    'invalid',
    'straight',
    'flush',
    'fullhouse',
    'quadra',
    'straight_flush'
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
    const sortedCards = [...cards].sort((a, b) => valuesEnum[a.value] - valuesEnum[b.value]);
    let prevValue: number = valuesEnum[sortedCards[0].value];
    const sortedCardsWithoutFirst = sortedCards.slice(1);
    for (const card of sortedCardsWithoutFirst) {
        if (valuesEnum[card.value] - prevValue !== 1) {
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

    if ([leftPart.length, rightPart.length].includes(4)) {
        return true;
    }

    return false;
};

const isStraightFlush = (cards: Card[]) => isFlush(cards) && isStraight(cards);

const classifyCardsCombination = (pipeline: combinationValidatorCB[]) => (cards: Card[]): fiveCardsCombinationEnum => {
    let rank = -1;
    for (let i = 0; i < pipeline.length; i++) {
        if (!cards || cards.length < 1) {
            break;
        }
        const classifyCombination = pipeline[i];
        if (classifyCombination(cards)) {
            rank = i;
            break;
        }
    }

    return rank + 1;
}

const validateFiveCards = (droppedCards: Card[], isFreeTurn: boolean) => (selectedCards: Card[]) => {
    if (!selectedCards || !hasLength(5)(selectedCards)) {
        return false;
    }
window.alert("wew")
    const classificationPipe = [isStraight, isFlush, isFullHouse, isQuadra, isStraightFlush];
    const droppedCardsRank = classifyCardsCombination(classificationPipe)(droppedCards);
    const selectedCardsRank = classifyCardsCombination(classificationPipe)(selectedCards);

    if (selectedCardsRank === fiveCardsCombinationEnum.invalid) {
        return false;
    }
window.alert("2")
    if (isFreeTurn) {
        return true;
    }
console.log("wew3")
    window.alert(JSON.stringify({a:fiveCardsCombinationEnum[selectedCardsRank], b:fiveCardsCombinationEnum[droppedCardsRank]}))
    if (selectedCardsRank < droppedCardsRank) {
        return false;
    }
window.alert("wew4")
    if (selectedCardsRank > droppedCardsRank) {
        return true;
    }
window.alert("wew5")
    let _dropped, _selected;
    switch (selectedCardsRank) {
        case fiveCardsCombinationEnum.fullhouse:
            _dropped = getPartWith(3)(splitCardsByValue(droppedCards));
            _selected = getPartWith(3)(splitCardsByValue(selectedCards));
            break;
                
        case fiveCardsCombinationEnum.quadra:
            _dropped = getPartWith(4)(splitCardsByValue(droppedCards));
            _selected = getPartWith(4)(splitCardsByValue(selectedCards));
            break;
    
        default:
            _dropped = droppedCards;
            _selected = selectedCards;
            break;
    }
window.alert(JSON.stringify({_dropped, _selected}))
    return areSelectedCardsHigher(_dropped, _selected);
}

const checkSelectedCardsValidity = (droppedCards: Card[], isFreeTurn: boolean): combinationValidatorCB => {
    let droppedCardsCount = droppedCards.length;
    switch (droppedCardsCount) {
        case 1:
            return (selectedCards) => {
                return (
                    hasLength(1)(selectedCards) && 
                    (isFreeTurn || areSelectedCardsHigher(droppedCards, selectedCards))
                    );
            }
            
        case 2:
            return (selectedCards) => {
                return (
                    hasLength(2)(selectedCards) &&
                    areIdenticalValues(selectedCards) &&
                    (isFreeTurn || areSelectedCardsHigher(droppedCards, selectedCards))
                    );
            }
            
        case 3:
            return (selectedCards) => {
                return (
                    hasLength(3)(selectedCards) &&
                    areIdenticalValues(selectedCards) &&
                    (isFreeTurn || areSelectedCardsHigher(droppedCards, selectedCards))
                    );
            }
            
        case 5:
            return validateFiveCards(droppedCards, isFreeTurn);

        default:
            return () => false;
    }
};

export default checkSelectedCardsValidity;
