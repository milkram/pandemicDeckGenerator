export default class Card {
  readonly card_type: string;
  readonly name?: string;

  constructor({ card_type, name }) {
    this.card_type = card_type;
    if (name) this.name = name;
  }

  hello() {
    console.log(`i am a ${this.name} of ${this.card_type}`);
  }
}
