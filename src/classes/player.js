export default class Player {
  constructor(position) {
    this.name = `PLAYER_${position+1}`;
    this.position = position;
    this.hand = [];
  }
}
