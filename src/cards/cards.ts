import cities from './data/cities.json';
import epidemics from './data/epidemics.json';
import events from './data/events.json'; // to-do: dynamically load all json from the ./data/ folder versus one by one
import Card from '../classes/card';

interface InterfaceCard {
  readonly card_type: string,
  readonly name?: string
}

const fetchAllCards = () => {
  const cards: Array<InterfaceCard> = [];
  cities.forEach(cardData => cards.push(new Card({ card_type: cardData.card_type, name: cardData.name })));
  epidemics.forEach(cardData => cards.push(new Card({ card_type: cardData.card_type, name: '' }))); // fix this. should be able to pass `name: cardData.name`.
  events.forEach(cardData => cards.push(new Card({ card_type: cardData.card_type, name: cardData.name })));
  return cards;
}

export const cityCards = cities;
export const epidemicCards = epidemics;
export const eventCards = events;
export const allCards = fetchAllCards();
