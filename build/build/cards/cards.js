"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var module_1 = __importDefault(require());
var module_2 = __importDefault(require());
var module_3 = __importDefault(require());
exports.deck = {
    cities: JSON.parse(module_1.default),
    epidemics: JSON.parse(module_2.default),
    events: JSON.parse(module_3.default),
};
