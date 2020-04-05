export default class Player {
  constructor(position) {
    this.name = `PLAYER_${position+1}`;
    this.position = position;
    this.hand = [];
    this.isPlayersTurn = false;
  }

  drawCard(player) {}

  playCard(card) {}

  removeCardFromGame() {}
}
