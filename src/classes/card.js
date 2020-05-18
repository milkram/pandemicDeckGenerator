export default class Card {
  constructor({ card_type, name, color, side_effect }) {
    this.card_type = card_type;
    if (name) this.name = name;
    if (color) this.color = color;
    if (side_effect) this.side_effect = side_effect;
  }
}
