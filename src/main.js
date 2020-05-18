import Game from './classes/game';
const g = new Game({ players: ['mark', 'kenny', 'jenny', 'bern'], logging: true });
g.newGame();
g.startGame();
