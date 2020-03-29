import { allCards } from '../cards/cards';

interface InterfaceCard {
  readonly card_type: string,
  readonly name?: string
}

interface InterfaceDeck extends Array<InterfaceCard> {}

export class Deck {
  cards: InterfaceDeck;

  constructor() {
    this.cards = allCards;
  }

  selectEventCards() { }
}
