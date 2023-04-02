export const Suits = ['♠️', '♥️', '♣️', '♦️'] as const;
export type Suit = typeof Suits[number]
export const Ranks = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2', 'X', 'Y'] as const // X Y 代表大小王 '♠️' | '♥️' | '♣️' | '♦️'
export type Rank = typeof Ranks[number]

export class PokerPoint {
  readonly value: number;
  readonly rank: Rank;
  constructor(point: number | Rank) {
    if (typeof point === "number") {
      if (point > 14 || point < 0) throw new Error("value not in range");
      this.value = point;
      this.rank = Ranks[point];
    } else if (typeof point === "string") {
      this.rank = point;
      this.value = Ranks.findIndex((e) => e === point);
    } else throw new Error(" illegal type of value ");
  }
  isSame(point: PokerPoint): boolean {
    return this.rank === point.rank && this.value === point.value;
  }
}

export class PokerCard extends PokerPoint {
  readonly suit?: Suit;
  constructor(point: number | Rank, suit?: Suit) {
    super(point)
    this.suit = suit;
  }
  isSame(card: PokerCard): boolean {
    return this.suit === card.suit && super.isSame(card);
  }
  get isJoker(): boolean {
    return this.value > 12;
  }
}

export const createDeck = () => {
  const numCards = Suits.map((suit) => Ranks.slice(0, 13).map((rank, i) => new PokerCard(rank, suit))).flat()
  return [...numCards, new PokerCard('X'), new PokerCard('Y')]
}

export const shuffle = <T>(arr: T[]) => arr.sort(() => Math.random() - 0.5)