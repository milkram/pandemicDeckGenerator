export default class Card {
  constructor({ card_type, name }) {
    this.card_type = card_type;
    if (name) this.name = name;
  }

  hello() {
    console.log('hello');
  }
}
