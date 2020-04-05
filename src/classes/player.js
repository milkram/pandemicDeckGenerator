export default class Player {
  constructor({
    position,
    onDrawCard,
    onDiscardCard,
    onRemoveCardFromGame,
    onTransferCardToTargetPlayer,
  }) {
    this.name = `PLAYER_${position+1}`;
    this.position = position;
    this.hand = [];
    this.isPlayersTurn = false;
    this.onDrawCard = onDrawCard;
    this.onDiscardCard = onDiscardCard;
    this.onRemoveCardFromGame = onRemoveCardFromGame;
    this.onTransferCardToTargetPlayer = onTransferCardToTargetPlayer;
  }

  drawCard() {
    this.onDrawCard({ player: this });
  }

  discardCard({ cardIdx }) {
    const card = this.hand[cardIdx];
    this.onDiscardCard({ player: this, card });
  }

  removeCardFromGame({ cardIdx }) {
    const card = this.hand[cardIdx];
    this.onRemoveCardFromGame({ player: this, card });
  }

  transferCardToTargetPlayer({ targetPlayerIdx, cardIdx }) {
    if (targetPlayerIdx === this.position) console.log('--- Card transfer cancelled: CANNOT TRANSFER TO SELF --- ');

    const card = this.hand[cardIdx];
    this.onTransferCardToTargetPlayer({ currentPlayer: this, targetPlayerIdx, card });
  }
}
