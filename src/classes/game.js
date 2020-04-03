import Deck from './deck';
import Player from './player';

export default class Game {
  constructor({ players }) {
    this.decks = []; // array of objects {}
    this.players = this.createPlayersWithNumberOfPlayers(players);
  }

  createPlayersWithNumberOfPlayers(numberOfPlayers) {
    const groupingOfPlayers = [];
    for (let x = 0; x < numberOfPlayers; x++) {
      groupingOfPlayers.push(new Player(x));
    }
    return groupingOfPlayers;
  }

  newGame() {
    // creates the PLAYER and INFECTION decks
    this.decks = {
      player: new Deck('PLAYER'),
      infection: new Deck('INFECTION'),
    };

    // prepares the player deck for a new game by distributing cards to new players
    this.decks.player.prepareCardsForNewGame({ players: this.players });
    this.decks.infection.prepareCardsForNewGame();
  }
}
