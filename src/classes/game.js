
import colors from 'colors';
import emoji from 'node-emoji';
import Deck from './deck';
import Player from './player';

export default class Game {
  constructor({ players, logging }) {
    this.logging = logging;
    this.decks = []; // array of objects {}
    this.players = this._createNumberOfPlayers(players);
    this.infectRate = [2,2,2,3,3,4,4]; // front is the current infectRate
  }

  newGame() {
    // creates the PLAYER and INFECTION decks
    if (this.logging) {
      console.log("---- NEW GAME STARTED ----");
      console.log("");
      console.log(`${emoji.get('woman-raising-hand')}${emoji.get('man-raising-hand')} ` + 'Players:');
      for (let x = 0; x < this.players.length; x++) {
        console.log(`- ${this.players[x].name}`);
      }
      console.log('');
    }
    this.decks = {
      player: new Deck({ type: 'PLAYER', logging: this.logging }),
      infection: new Deck({ type: 'INFECTION', logging: this.logging }),
    };
  }

  // private
  _createNumberOfPlayers(numberOfPlayersOrNames) {
    const groupingOfPlayers = [];
    let num = 0;
    let names = [];
    if (Array.isArray(numberOfPlayersOrNames)) {
      num = numberOfPlayersOrNames.length;
      names = numberOfPlayersOrNames;
    }
    else num = numberOfPlayersOrNames;

    for (let x = 0; x < num; x++) {
      groupingOfPlayers.push(new Player(
        {
          name: names.length > 0 ? names[x] : undefined,
          position: x,
          onDrawCard: ({ player, numberOfCards }) => this.onPlayerDrawCard({ player, numberOfCards }),
          onDiscardCard: (player) => this.onPlayerDiscardCard(player),
          onRemoveCardFromGame: (player) => this.onPlayerRemoveCardFromGame(player),
          onTransferCardToTargetPlayer: (player) => this.onPlayerTransferCardToTargetPlayer(player),
          onEndTurn: (player) => this.onPlayerEndTurn(player),
          onGetCard: ({ player, cardName }) => this.onPlayerGetCard({ player, cardName }),
        }
      ));
    }
    return groupingOfPlayers;
  }

  randomlySelectCurrentPlayersTurn() {
    const randomlySelectedPlayersIndex = (Math.round(Math.random() * (this.players.length - 1)));
    this.players[randomlySelectedPlayersIndex].isPlayersTurn = true;
  }

  getCurrentPlayersTurn() {
    return this.players.find(player => player.isPlayersTurn);
  }

  startGame() {
    // prepares the player deck for a new game by distributing cards to new players
    if (this.logging) {
      console.log('---- START PREGAME STEPS ----');
      console.log('');
    }
    this.decks.player.prepareCardsForNewGame({ players: this.players });
    this.decks.infection.prepareCardsForNewGame();
    this.reportPlayerCards();
    this.randomlySelectCurrentPlayersTurn();
    if (this.logging) {
      console.log('');
      console.log('---- GAME START ----');
      console.log('');
      console.log(`it is ${this.getCurrentPlayersTurn().name}'s turn`.green);
      console.log('');
    }
  }

  // card drawing
  onPlayerDrawCard({ player, numberOfCards = 1 }) {
    // console.log('onPlayerDrawCard(): the draw pile from player deck before', this.decks.player.cards.draw);
    // console.log("onPlayerDrawCard(): player's hand before", player.hand);

    for (let x = 0; x < numberOfCards; x++) {
      if (this.decks.player.cards.draw.length === 0) {
        if (this.logging) {
          console.log(`${emoji.get('skull')} ` + 'Draw pile has no more cards');
          console.log('');
        }
        return;
      }

      const card = this.decks.player.cards.draw.shift();
      if (this.logging) {
        let cardName = '...'.green
        if (card.card_type !== 'epidemic') cardName = `: `.green + `${card.name}`[card.color];
        console.log(`${emoji.get('black_joker')} ` + `${player.name} draws a card`.green + `${cardName}`);
        console.log('');
      }

      if (card.card_type === 'epidemic') this.onEpidemicDrawn();
      else player.hand.push(card);

      if (this.logging) {
        this.reportPlayerCards();
        console.log('');
      }
    }

    // console.log('onPlayerDrawCard(): the card being drawn', card);
    // console.log('onPlayerDrawCard(): the draw pile from player deck after', this.decks.player.cards.draw);
    // console.log("onPlayerDrawCard(): player's hand after", player.hand);
  }

  onPlayerDiscardCard({ player, card: cardToDiscard }) {
    // console.log("player's hand before", player.hand);

    if (this.logging) console.log(`${player.name} plays ` + `${cardToDiscard.name}`[cardToDiscard.color]);
    this.decks.player.cards.discard.push(cardToDiscard);
    player.hand = player.hand.filter(card => card.name !== cardToDiscard.name); // use mutable .splice() instead?

    // console.log("player's hand after", player.hand);
    // console.log("this.decks.player.cards.discard", this.decks.player.cards.discard);
  }

  onPlayerRemoveCardFromGame({ player, card: cardToRemoveFromGame }) {
    // console.log("onPlayerRemoveCardFromGame: player's hand before", player.hand);

    if (this.logging) console.log(`${player.name} removes ${cardToRemoveFromGame.name} from the game`);
    this.decks.player.cards.removed.push(cardToRemoveFromGame);
    player.hand = player.hand.filter(card => card.name !== cardToRemoveFromGame.name); // use mutable .splice() instead?

    // console.log("onPlayerRemoveCardFromGame: player's hand after", player.hand);
    // console.log("onPlayerRemoveCardFromGame: this.decks.player.cards.removed", this.decks.player.cards.removed);
  }

  onPlayerTransferCardToTargetPlayer({ currentPlayer, targetPlayerIdx, card: cardToTrade }) {
    // console.log("onPlayerTransferCardToTargetPlayer: current player's hand before", currentPlayer.hand);
    // console.log("onPlayerTransferCardToTargetPlayer: target player's hand before", this.players[targetPlayerIdx].hand);
    // console.log("onPlayerTransferCardToTargetPlayer: card being transfered", cardToTrade);

    const targetPlayer = this.players[targetPlayerIdx];
    if (this.logging) console.log(`${currentPlayer.name} transfers ${cardToTrade.name} to ${targetPlayer.name}`);
    targetPlayer.hand.push(cardToTrade);
    currentPlayer.hand = currentPlayer.hand.filter(card => card.name !== cardToTrade.name);

    // console.log("onPlayerTransferCardToTargetPlayer: current player's hand after", currentPlayer.hand);
    // console.log("onPlayerTransferCardToTargetPlayer: target player's hand after", this.players[targetPlayerIdx].hand);
  }

  onPlayerEndTurn({ player }) {
    player.isPlayersTurn = false;
    if (this.logging) console.log(`${player.name} ends their turn`);

    const nextPlayerIdx = player.position + 1;
    if (nextPlayerIdx > (this.players.length-1)) {
      this.players[0].isPlayersTurn = true;
      if (this.logging) console.log(`it is ${this.players[0].name}'s turn`.green);
    } else {
      this.players[nextPlayerIdx].isPlayersTurn = true;
      if (this.logging) console.log(`it is ${this.players[nextPlayerIdx].name}'s turn`.green);
    }
  }

  // events
  infectCities() {
    if (this.logging) {
      console.log(`${emoji.get('skull')} ` + 'INFECT CITIES'.red);
      console.log(`** Infect the following cities with 1 disease cube: **`);
    }
    const infectCardsToDraw = this.infectRate[0];
    for (let x = 0; x < infectCardsToDraw; x++) {
      const infectionCard = this.decks.infection.cards.draw.shift();
      this.decks.infection.cards.discard.push(infectionCard);
      if (this.logging) console.log(`- ` + `${infectionCard.name}`[infectionCard.color]);
    }
    if (this.logging) console.log('');
  }

  increaseInfectRate() {
    this.infectRate.shift();
    if (this.logging) {
      console.log('New infection rate: ' + '[' + this.infectRate.toString() + ']');
      console.log('');
    }
  }

  onEpidemicDrawn() {
    // when an epidemic is drawn:
    // - draw the bottom card from the infect pile, infect city with 3 cubes
    const cityCardFromBottomOfDeck = this.decks.infection.cards.draw.pop();
    this.decks.infection.cards.discard.push(cityCardFromBottomOfDeck);

    if (this.logging) {
      console.log('');
      console.log(`${emoji.get('skull')}`.repeat(3) + ' EPIDEMIC HAS BEEN DRAWN '.red + `${emoji.get('skull')}`.repeat(3));
      console.log(`** Infect the following cities with 3 disease cubes: **`);
      console.log(`- ` + `${cityCardFromBottomOfDeck.name}`[cityCardFromBottomOfDeck.color]);
      console.log('');
    }


    // - shuffle the discard pile
    // console.log('before this.decks.infection.cards.discard', this.decks.infection.cards.discard);
    this.decks.infection.shuffleCards(this.decks.infection.cards.discard); // modify this function to live on game
    // console.log('after this.decks.infection.cards.discard', this.decks.infection.cards.discard);

    // - place shuffled discard pile onto the top of the draw pile
    // console.log('this.decks.infection.cards.draw before', this.decks.infection.cards);
    this.decks.infection.cards.draw = [...this.decks.infection.cards.discard, ...this.decks.infection.cards.draw];

    // - empty out the discard pile
    this.decks.infection.cards.discard = [];
    // console.log('this.decks.infection.cards.draw after', this.decks.infection.cards);

    this.increaseInfectRate();
  }

  onPlayerGetCard({ player, cardName = undefined }) {
    // look through all the cards: other players, draw, discard, removed, pregame
    if (!cardName) {
      if (this.logging) console.log('Invalid card name entered');
      return;
    }
    const targetPlayer = this.players[player.position];
    if (!targetPlayer) return;

    let foundCard = undefined;
    let foundFromPlayer = undefined;
    let foundFromPlayerDeck = undefined;

    for (let x = 0; x < this.players.length; x++) {
      const found = this.players[x].hand.find(card => card.name === cardName);
      if (found) {
        foundCard = found;
        foundFromPlayer = this.players[x];
      }

      if (foundCard && foundFromPlayer) {
        if (x === targetPlayer.position) {
          if (this.logging) console.log(`${foundCard.name}`[foundCard.color] + ` is already in ${targetPlayer.name}'s hand`);
          break;
        }

        targetPlayer.hand.push(foundCard);
        foundFromPlayer.hand = foundFromPlayer.hand.filter(card => card.name !== cardName);
        if (this.logging) console.log(`${targetPlayer.name} got ` + `${foundCard.name}`[foundCard.color] + ` from ${foundFromPlayer.name}`);
        break;
      }
    }

    if (!foundCard) {
      const decks = Object.entries(this.decks.player.cards);
      for (let x = 0; x < decks.length; x++) {
        const [key, cards] = decks[x];
        const found = cards.find(card => card.name === cardName);

        if (found) {
          foundCard = found;
          foundFromPlayerDeck = key;
        }

        if (foundCard && foundFromPlayerDeck) {
          targetPlayer.hand.push(foundCard);
          this.decks.player.cards[foundFromPlayerDeck] = this.decks.player.cards[foundFromPlayerDeck].filter(card => card.name !== cardName);
          if (this.logging) console.log(`${targetPlayer.name} got ` + `${foundCard.name}`[foundCard.color] + ` from ${foundFromPlayerDeck} pile`);
          break;
        }
      }
    }

    if (!foundCard && this.logging) console.log(`Cannot find card by name "${cardName}"`);
  }

  // logging
  reportPlayerCards() {
    if (this.logging) {
      for (let y = 0; y < this.players.length; y++) {
        if (this.players[y].hand.length === 0){
          console.log(`${this.players[y].name} has no cards`);
        } else {
          const handToString = this.players[y].hand.reduce((string, value, idx) => {
            let asterisk = '';
            const cardCount = this.players[y].hand.length;
            if (value.side_effect) asterisk = '*';

            const addString = (this.players[y].hand.length-1) === idx ? `${value.name}${asterisk}`[value.color] + ` (${cardCount})` : `${value.name}${asterisk}`[value.color] + `, `
            return string + addString;
          }, '');
          console.log(`${this.players[y].name} has ${handToString}`);
        }
      }
    }
  }

  // aliases
  report() {
    this.reportPlayerCards();
  }

  infect() {
    this.infectCities();
  }

  end() {
    this.players.find(player => player.isPlayersTurn).endTurn();
  }

  endAll() {
    this.draw(2);
    this.infect();
    this.players.find(player => player.isPlayersTurn).endTurn();
  }

  player(name = undefined) {
    if (name) {
      const player = this.players.find(player => player.name === name);
      if (player) return player;
      if (this.logging) console.log(`Cannot find player ${name}`.red)
      return undefined;
    }
    return this.players.find(player => player.isPlayersTurn);
  }

  draw(numberOfCards = 1, name = undefined) {
    // draws card for the current player
    if (name) {
      const player = this.players.find(player => player.name === name);
      if (player) {
        player.drawCard(numberOfCards);
      } else {
        if (this.logging) console.log(`Cannot find player ${name}`);
      }
    } else {
      const player = this.players.find(player => player.isPlayersTurn)
      player.drawCard(numberOfCards);
    }
  }

  discard(cardName = undefined) {
    const foundPlayerWithCard = this.players.find(player => player.hand.find(card => card.name === cardName));
    if (foundPlayerWithCard) foundPlayerWithCard.discard(cardName);
    else if (this.logging) console.log('Cannot find card ' + `"${cardName}"` + " in any player's hand");
  }

  play(cardName = undefined) {
    this.discard(cardName);
  }

  discardPile(pile = 'infection') {
    if (this.logging) {
      console.log(this.decks[pile].cards.discard);
      console.log('');
    }
  }
}
