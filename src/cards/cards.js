import cities from './data/cities.json';
import epidemics from './data/epidemics.json';
import events from './data/events.json'; // to-do: dynamically load all json from the ./data/ folder versus one by one
import Card from '../classes/card';

const populateDeck = (type) => { // type can be 'PLAYER' or 'INFECTION'
  function constructCard({ card_type, name, color, side_effect }) {
    cards.push(new Card({ card_type, name: name ? name : undefined, color: color ? color : undefined, side_effect: side_effect ? side_effect : undefined }));
  }

  const cards = [];
  switch (type) {
    case 'INFECTION': {
      cities.forEach(cardData => constructCard(cardData));
      break;
    }
    case 'PLAYER':
    default: {
      cities.forEach(cardData => constructCard(cardData));
      epidemics.forEach(cardData => constructCard(cardData));
      events.forEach(cardData => constructCard(cardData));
      break;
    }
  }

  return cards;
}

export const cityCards = cities;
export const epidemicCards = epidemics;
export const eventCards = events;
export const createDeck = populateDeck;
