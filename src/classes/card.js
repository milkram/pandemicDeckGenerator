export default class Card {
  constructor({ card_type, name, color }) {
    this.card_type = card_type;
    if (name) this.name = name;
    if (color) this.color = color;
  }
}
