import { createDeck } from '../cards/cards';
import { chunkArray } from '../lib/chunkArray.js';

// polyfill for Array.flat()
if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat', {
    value: function(depth = 1, stack = []) {
      for (let item of this) {
        if (item instanceof Array && depth > 0) {
          item.flat(depth - 1, stack);
        } else stack.push(item);
      }
      return stack;
    }
  });
}

export default class Deck {
  constructor({ type, logging }) {
    this.type = type; // INFECTION, PLAYER
    this.logging = logging;
    this.cards = {
      draw: [],
      discard: [],
      removed: [],
      pregame: createDeck(type),
    };
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

  // private methods
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
    // draw 9 cards into the discard pile
    this.shuffleCards(this.cards.pregame);

    // infect 3 cities with 3 cubes, 3x2, 3x1
    for (let x = 0; x < 3; x++) {
      this.cards.discard.push(this.cards.pregame.shift());
      this.cards.discard.push(this.cards.pregame.shift());
      this.cards.discard.push(this.cards.pregame.shift());

      if (this.logging) {
        console.log(`** Infect the following cities with ${3-x} disease cubes: **`);
        const first = this.cards.discard[this.cards.discard.length - 1]
        const second = this.cards.discard[this.cards.discard.length - 2]
        const third = this.cards.discard[this.cards.discard.length - 3]

        console.log(`- ` + `${first.name}`[first.color]);
        console.log(`- ` + `${second.name}`[second.color]);
        console.log(`- ` + `${third.name}`[third.color]);
        console.log('');
      }
    }

    // move remaining cards into draw pile
    this.cards.draw = this.cards.pregame;
    this.cards.pregame = [];
  }
}
