export interface InterfaceCard {
  readonly card_type: string,
  readonly name?: string
}

export interface InterfaceDeck extends Array<InterfaceCard> {}
