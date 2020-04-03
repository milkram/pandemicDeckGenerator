import { createDeck } from '../cards/cards';
import { chunkArray } from '../lib/chunkArray.js';

export default class Deck {
  constructor(type) {
    this.type = type; // INFECTION, PLAYER
    this.cards = {
      draw: [],
      discard: [],
      removed: [],
      pregame: createDeck(type),
    };
  }

  prepareCardsForNewGame(opts) {
    if (this.type === 'INFECTION') this.prepareInfectionDeck();
    else if (this.type === 'PLAYER') this.preparePlayerDeck(opts.players);
  }

  preparePlayerDeck(players) {
    // 48 cards + X sponsored events in the player deck
    // combine cards + sponsored events together, shuffle them
    // give players X cards

    // shuffle cards + sponsored events into the player deck
    const cardsSeparatedByCardType = this.cards.pregame.reduce((acc, card) => {
      if (card.card_type === 'city' || card.card_type === 'sponsored_event') acc.push(card);
      return acc;
    }, []);
    this.shuffleCards(cardsSeparatedByCardType);

    // distribute cards to each player
    let cardsPerPlayer;
    switch (players.count) {
      case 2: {
        cardsPerPlayer = 4;
        break;
      }
      case 3: {
        cardsPerPlayer = 3;
        break;
      }
      default:
      case 4: {
        cardsPerPlayer = 2;
        break;
      }
    }

    for (let x = 0; x < cardsPerPlayer; x++) {
      for (let y = 0; y < players.length; y++) {
        players[y].hand.push(cardsSeparatedByCardType.shift())
      }
    }

    // separate into 5 piles
    const totalPilesDesired = 5;
    const roundedDownNumberOfCardsPerPile = Math.floor(cardsSeparatedByCardType.length / totalPilesDesired);
    const piles = chunkArray(cardsSeparatedByCardType, roundedDownNumberOfCardsPerPile);

    if (piles.length > totalPilesDesired) {
      const remainingArrayIndexesToInsertLeftOverCards = [];
      const unwantedLastPile = piles[piles.length - 1];
      while (unwantedLastPile.length > remainingArrayIndexesToInsertLeftOverCards.length) {
        const randomIndex = Math.floor(Math.random() * (piles.length - 1));
        if (remainingArrayIndexesToInsertLeftOverCards.indexOf(randomIndex) === -1) remainingArrayIndexesToInsertLeftOverCards.push(randomIndex);
      }
      remainingArrayIndexesToInsertLeftOverCards.forEach(el => piles[el].push(piles[piles.length - 1].shift()))
      piles.splice(piles.length-1);
    }

    // place epidemic cards into a random position
    const epidemicCards = this.shuffleCards(this.cards.pregame.filter(el => el.card_type === "epidemic"));
    piles.forEach((pile, idx) => pile.push(epidemicCards[idx]));
    piles.forEach(pile => this.shuffleCards(pile));

    this.cards.pregame = [];
    this.cards.draw = piles.flat();
  }

  prepareInfectionDeck() {
    console.log('prepareInfectionDeck');
  }

  shuffleCards(pile) { // 'draw' | 'discard' | 'removed' | 'all' | Array
    let array;
    if (typeof pile === 'string') array = this.cards[pile];
    else if (Array.isArray(pile)) array = pile;

    // How to randomize (shuffle) a JavaScript array? - https://stackoverflow.com/a/2450976
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    if (Array.isArray(pile)) return array;
  }
}
