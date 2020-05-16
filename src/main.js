import Game from './classes/game';
const g = new Game({ players: ['mark', 'kenny', 'jenny', 'bern'], logging: true });
//
g.newGame();
g.startGame();
//
// game.reportPlayerCards()
// game.decks.infection.cards.draw.length
// game.decks.infection.cards.discard.length

// game.getCurrentPlayersTurn().drawCard()
// game.infectCities()
// game.getCurrentPlayersTurn().endTurn()
