import Deck from './deck';
import Player from './player';

export default class Game {
  constructor({ players, logging }) {
    this.logging = logging;
    this.decks = []; // array of objects {}
    this.players = this.createNumberOfPlayers(players);
    this.infectRate = [2,2,2,3,3,4,4]; // front is the current infectRate
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
      console.log('');
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
    if (this.logging) console.log('---- START PREGAME STEPS ----');
    this.decks.player.prepareCardsForNewGame({ players: this.players });
    this.decks.infection.prepareCardsForNewGame();
    this.randomlySelectCurrentPlayersTurn();
    if (this.logging) {
      console.log('---- END PREGAME STEPS ----');
      console.log('---- GAME START ----');
      console.log('');
      console.log(`** ${this.getCurrentPlayersTurn().name}'s turn **`);
      console.log('');
    }
  }

  // card drawing
  onPlayerDrawCard({ player }) {
    // console.log('onPlayerDrawCard(): the draw pile from player deck before', this.decks.player.cards.draw);
    // console.log("onPlayerDrawCard(): player's hand before", player.hand);

    if (this.logging) console.log(`${player.name} draws a card`);

    const card = this.decks.player.cards.draw.shift();
    if (card.card_type === 'epidemic') this.onEpidemicDrawn();
    else player.hand.push(card);

    // console.log('onPlayerDrawCard(): the card being drawn', card);
    // console.log('onPlayerDrawCard(): the draw pile from player deck after', this.decks.player.cards.draw);
    // console.log("onPlayerDrawCard(): player's hand after", player.hand);
  }

  onPlayerDiscardCard({ player, card: cardToDiscard }) {
    // console.log("player's hand before", player.hand);

    if (this.logging) console.log(`${player.name} plays ${cardToDiscard.name}`);
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
    if (this.logging) console.log(`${player.name} transfers ${cardToTrade.name} to ${targetPlayer}`);
    targetPlayer.hand.push(cardToTrade);
    currentPlayer.hand = currentPlayer.hand.filter(card => card.name !== cardToTrade.name);

    // console.log("onPlayerTransferCardToTargetPlayer: current player's hand after", currentPlayer.hand);
    // console.log("onPlayerTransferCardToTargetPlayer: target player's hand after", this.players[targetPlayerIdx].hand);
  }

  // events
  onEpidemicDrawn() {
    // when an epidemic is drawn:
    // - draw the bottom card from the infect pile, infect city with 3 cubes
    const cityCardFromBottomOfDeck = this.decks.infection.cards.draw.pop();
    this.decks.infection.cards.discard.push(cityCardFromBottomOfDeck);

    if (this.logging) {
      console.log('---- EPIDEMIC HAS BEEN DRAWN ----');
      console.log(`** Infect the following cities with 3 disease cubes: **`);
      console.log(cityCardFromBottomOfDeck);
      console.log('');
    }

    // - shuffle the discard pile
    // console.log('before this.decks.infection.cards.discard', this.decks.infection.cards.discard);
    this.decks.infection.shuffleCards(this.decks.infection.cards.discard); // modify this function to live on game
    // console.log('after this.decks.infection.cards.discard', this.decks.infection.cards.discard);

    // - place shuffled discard pile onto the top of the draw pile
    // console.log('this.decks.infection.cards.draw before', this.decks.infection.cards.draw);
    this.decks.infection.cards.draw = [...this.decks.infection.cards.discard, ...this.decks.infection.cards.draw];
    // console.log('this.decks.infection.cards.draw after', this.decks.infection.cards.draw);
  }
}
