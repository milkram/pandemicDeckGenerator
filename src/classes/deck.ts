// import { cards } from '../cards/cards';
import cities from '../cards/cities.json';
import epidemics from '../cards/epidemics.json';
import events from '../cards/events.json';

interface InterfaceCard {
  readonly card_type: string,
  readonly name?: string
}

interface InterfaceDeck extends Array<InterfaceCard> {}

export class Deck {
  cards: InterfaceDeck;

  constructor() {
    this.cards = this.initCards();
    // console.log('cities', cities);
    // for (card in cities) {
    //   console.log('obj', card);
    // }
  }

  initCards() {
    let bleh: Array<InterfaceCard> = [];
    epidemics.forEach(c => bleh.push(c))
    cities.forEach(c => bleh.push(c))
    events.forEach(c => bleh.push(c))
    return bleh;
  }
}
