export class Card {
  constructor({ type, name }) {
    this.type = type;
    this.name = name;
  }

  hello() {
    console.log(`i am a ${name} of ${type}`);
  }
}
