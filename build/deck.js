"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cards_2 = __importDefault(require("./cards/cards"));
var Deck = /** @class */ (function () {
    function Deck() {
        this.deck = DECK;
    }
    Deck.prototype.hello = function () {
        console.log('deck', cards_2.default);
    };
    return Deck;
}());
exports.Deck = Deck;
