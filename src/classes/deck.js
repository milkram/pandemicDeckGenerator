import { allCards } from '../cards/cards';

export default class Deck {
  constructor() {
    this.cards = allCards;
  }

  shuffle() {
    console.log('shuffle');
  }
}
