# pandemic
by milkram

---

## to do:
### INFECT PILE: 48 cards
  - [ ] draw and infect 9 cities (3x3 cubes, 3x2 cubes, 3x1 cubes)
    - the nine cards will simply live in the discard pile to start
  - [ ] react to when an epidemic is drawn
    - [ ] draw an infect card from the BOTTOM of the deck and infect city with 3 cubes
  - [ ] shuffle the discard cards, place it on top of the draw cards
### PLAYER PILE: 48 cards + 5 epidemics + X sponsored events
  - [x] combine cards + sponsored events together, shuffle them
  - [x] give each player X cards (3)
  - [x] separate remaining draw cards into 5 piles
  - [x] insert 1 epidemic into each piles
  - [x] combine piles back together

# my random notes:
// console.log(game.decks.player.cards);
// console.log('game.getCurrentPlayersTurn()', game.getCurrentPlayersTurn());

// current player:
// - play (discard) any card: `game.getCurrentPlayersTurn().discardCard(card)`
// - end turn (which draws 2 cards): `game.currentPlayersTurn.endTurn()`
//   - react to epidemic card
//   - discard a card if over X hand size (later)
// - transfer card to another player
// not current player:
// - play an event card (discards it)
// - transfer card to another player

---
// player: discarding a card
//   any player:
//   game.players[2].discardCard({ cardIdx: 1 }));
//   current player:
//   game.getCurrentPlayersTurn().discardCard({ cardIdx: 1 });

// player: removing a card from game
//   any player:
//   game.players[2].removeCardFromGame({ cardIdx: 1 }));
//   current player:
//   game.getCurrentPlayersTurn().removeCardFromGame({ cardIdx: 1 });

// player: transfering a card to another player
//   any player:
//   game.players[0].transferCardToTargetPlayer({ targetPlayerIdx: 1, cardIdx: 1 });
//   current player:
//   game.getCurrentPlayersTurn().transferCardToTargetPlayer({ targetPlayerIdx: 1, cardIdx: 1 });
