import cities from './data/cities.json';
import epidemics from './data/epidemics.json';
import events from './data/events.json'; // to-do: dynamically load all json from the ./data/ folder versus one by one
import Card from '../classes/card';

const fetchAllCards = () => {
  function constructCard({ card_type, name }) {
    cards.push(new Card({ card_type, name: name ? name : undefined }));
  }

  const cards = [];
  cities.forEach(cardData => constructCard(cardData));
  epidemics.forEach(cardData => constructCard(cardData));
  events.forEach(cardData => constructCard(cardData));
  return cards;
}

export const cityCards = cities;
export const epidemicCards = epidemics;
export const eventCards = events;
export const allCards = fetchAllCards();
