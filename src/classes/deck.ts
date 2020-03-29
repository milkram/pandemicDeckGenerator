import { allCards } from '../cards/cards';
import { InterfaceDeck } from 'src/types/custom.d';

export class Deck {
  cards: InterfaceDeck;

  constructor() {
    this.cards = allCards;
  }

  selectEventCards() { }
}
