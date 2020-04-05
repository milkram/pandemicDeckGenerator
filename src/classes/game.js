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
      groupingOfPlayers.push(new Player(
        {
          position: x,
          onDrawCard: (player) => this.onPlayerDrawCard(player),
          onDiscardCard: (player) => this.onPlayerDiscardCard(player),
          onRemoveCardFromGame: (player) => this.onPlayerRemoveCardFromGame(player),
          onTransferCardToTargetPlayer: (player) => this.onPlayerTransferCardToTargetPlayer(player),
        }
      ));
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

  // card drawing
  onPlayerDrawCard({ player }) {
    // console.log('game.drawCard()', player);
  }

  onPlayerDiscardCard({ player, card: cardToDiscard }) {
    // console.log("player's hand before", player.hand);

    this.decks.player.cards.discard.push(cardToDiscard);
    player.hand = player.hand.filter(card => card.name !== cardToDiscard.name); // use mutable .splice() instead?

    // console.log("player's hand after", player.hand);
    // console.log("this.decks.player.cards.discard", this.decks.player.cards.discard);
  }

  onPlayerRemoveCardFromGame({ player, card: cardToRemoveFromGame }) {
    // console.log("onPlayerRemoveCardFromGame: player's hand before", player.hand);

    this.decks.player.cards.removed.push(cardToRemoveFromGame);
    player.hand = player.hand.filter(card => card.name !== cardToRemoveFromGame.name); // use mutable .splice() instead?

    // console.log("onPlayerRemoveCardFromGame: player's hand after", player.hand);
    // console.log("onPlayerRemoveCardFromGame: this.decks.player.cards.removed", this.decks.player.cards.removed);
  }

  onPlayerTransferCardToTargetPlayer({ currentPlayer, targetPlayerIdx, card: cardToTrade }) {
    // console.log("onPlayerTransferCardToTargetPlayer: current player's hand before", currentPlayer.hand);
    // console.log("onPlayerTransferCardToTargetPlayer: target player's hand before", this.players[targetPlayerIdx].hand);
    // console.log("onPlayerTransferCardToTargetPlayer: card being transfered", cardToTrade);

    this.players[targetPlayerIdx].hand.push(cardToTrade);
    currentPlayer.hand = currentPlayer.hand.filter(card => card.name !== cardToTrade.name);

    // console.log("onPlayerTransferCardToTargetPlayer: current player's hand after", currentPlayer.hand);
    // console.log("onPlayerTransferCardToTargetPlayer: target player's hand after", this.players[targetPlayerIdx].hand);
  }
}
