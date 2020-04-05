import Deck from './deck';
import Player from './player';

export default class Game {
  constructor({ players, logging }) {
    this.logging = logging;
    this.decks = []; // array of objects {}
    this.players = this.createNumberOfPlayers(players);
  }

  createNumberOfPlayers(numberOfPlayers) {
    const groupingOfPlayers = [];
    for (let x = 0; x < numberOfPlayers; x++) {
      groupingOfPlayers.push(new Player(x));
    }
    return groupingOfPlayers;
  }

  newGame() {
    // creates the PLAYER and INFECTION decks
    if (this.logging) {
      console.log("---- NEW GAME STARTED ----");
      console.log('Players:');
      for (let x = 0; x < this.players.length; x++) {
        console.log(`- ${this.players[x].name}`);
      }
    }
    this.decks = {
      player: new Deck({ type: 'PLAYER', logging: this.logging }),
      infection: new Deck({ type: 'INFECTION', logging: this.logging }),
    };
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
    this.decks.player.prepareCardsForNewGame({ players: this.players });
    this.decks.infection.prepareCardsForNewGame();
    this.randomlySelectCurrentPlayersTurn();
    if (this.logging) {
      console.log('---- GAME START ----');
      console.log('');
      console.log(`** It is ${this.getCurrentPlayersTurn().name}'s turn **`);
      console.log('');
    }
  }
}
