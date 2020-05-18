export default class Player {
  constructor({
    name,
    position,
    onDrawCard,
    onDiscardCard,
    onRemoveCardFromGame,
    onTransferCardToTargetPlayer,
    onEndTurn,
    onGetCard,
  }) {
    this.name = name ? name : `PLAYER_${position+1}`;
    this.position = position;
    this.hand = [];
    this.isPlayersTurn = false;
    this.onDrawCard = onDrawCard;
    this.onDiscardCard = onDiscardCard;
    this.onRemoveCardFromGame = onRemoveCardFromGame;
    this.onTransferCardToTargetPlayer = onTransferCardToTargetPlayer;
    this.onEndTurn = onEndTurn;
    this.onGetCard = onGetCard;
  }

  drawCard(numberOfCards = 1) {
    this.onDrawCard({ player: this, numberOfCards });
  }

  discardCard(cardIdxOrName) {
    if (typeof cardIdxOrName === 'string' || cardIdxOrName instanceof String) {
      const card = this.hand.find(card => card.name === cardIdxOrName);
      if (card) this.onDiscardCard({ player: this, card });
      else console.log(`Cannot find card: ${cardIdxOrName}`.red);
    } else if (Number.isInteger(cardIdxOrName)) {
      const card = this.hand[cardIdxOrName];
      if (card) this.onDiscardCard({ player: this, card });
      else console.log(`Cannot find card at ${cardIdxOrName}`.red);
    }
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

  endTurn() {
    this.onEndTurn({ player: this });
  }

  get(cardName) {
    this.onGetCard({ player: this, cardName });
  }

  // aliases
  discard(cardIdxOrName) {
    this.discardCard(cardIdxOrName);
  }
}
