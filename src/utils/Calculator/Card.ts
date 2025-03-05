/**
 * Card, Rank, and Suit classes
 */

interface ICardName {
  singular: string;
  plural: string;
}

export class Suit {
  public static readonly CLUB: number = 1;
  public static readonly DIAMOND: number = 2;
  public static readonly HEART: number = 3;
  public static readonly SPADE: number = 4;

  public static all(): number[] {
    return [Suit.CLUB, Suit.DIAMOND, Suit.HEART, Suit.SPADE];
  }

  public static fromString(s: string): number {
    switch (s) {
      case "c":
        return Suit.CLUB;
      case "d":
        return Suit.DIAMOND;
      case "h":
        return Suit.HEART;
      case "s":
        return Suit.SPADE;
      default:
        throw new Error(`Invalid card suit: ${s}`);
    }
  }
}

export class Rank {
  public static readonly TWO: number = 2;
  public static readonly THREE: number = 3;
  public static readonly FOUR: number = 4;
  public static readonly FIVE: number = 5;
  public static readonly SIX: number = 6;
  public static readonly SEVEN: number = 7;
  public static readonly EIGHT: number = 8;
  public static readonly NINE: number = 9;
  public static readonly TEN: number = 10;
  public static readonly JACK: number = 11;
  public static readonly QUEEN: number = 12;
  public static readonly KING: number = 13;
  public static readonly ACE: number = 14;

  public static readonly names: (ICardName | null)[] = [
    null,
    null,
    { singular: "deuce", plural: "deuces" },
    { singular: "three", plural: "threes" },
    { singular: "four", plural: "fours" },
    { singular: "five", plural: "fives" },
    { singular: "six", plural: "sixes" },
    { singular: "seven", plural: "sevens" },
    { singular: "eight", plural: "eights" },
    { singular: "nine", plural: "nines" },
    { singular: "ten", plural: "tens" },
    { singular: "jack", plural: "jacks" },
    { singular: "queen", plural: "queens" },
    { singular: "king", plural: "kings" },
    { singular: "ace", plural: "aces" },
  ];

  public static fromString(s: string): number {
    switch (s) {
      case "t":
        return Rank.TEN;
      case "j":
        return Rank.JACK;
      case "q":
        return Rank.QUEEN;
      case "k":
        return Rank.KING;
      case "a":
        return Rank.ACE;
      default:
        const n: number = Number(s);
        if (isNaN(n) || n < Rank.TWO || n > Rank.NINE) {
          throw new Error(`Invalid card rank: ${s}`);
        }
        return n;
    }
  }

  public all(): number[] {
    return [
      Rank.TWO,
      Rank.THREE,
      Rank.FOUR,
      Rank.FIVE,
      Rank.SIX,
      Rank.SEVEN,
      Rank.EIGHT,
      Rank.NINE,
      Rank.TEN,
      Rank.JACK,
      Rank.QUEEN,
      Rank.KING,
      Rank.ACE,
    ];
  }
}

export class Card {
  protected rank: number;
  protected suit: number;

  public constructor(rank: number, suit: number) {
    this.rank = rank;
    this.suit = suit;
  }

  public static fromString(s: string): Card {
    const tmp: string = s.replace(/[^a-z0-9]/gi, "");
    if (tmp.length !== 2) {
      throw new Error(`Invalid card: ${tmp}`);
    }
    return new Card(
      Rank.fromString(tmp[0].toLowerCase()),
      Suit.fromString(tmp[1].toLowerCase())
    );
  }

  public getRank(): number {
    return this.rank;
  }

  public getSuit(): number {
    return this.suit;
  }

  public equals(c: Card): boolean {
    return this.getRank() === c.getRank() && this.getSuit() === c.getSuit();
  }

  public toString(
    suit: boolean = true,
    full?: boolean,
    plural?: boolean
  ): string {
    if (full) {
      const name = Rank.names[this.rank];
      if (!name) {
        throw new Error(`Invalid rank: ${this.rank}`);
      }
      return plural ? name.plural : name.singular;
    }

    let s: string = `${this.rank}`;
    if (this.rank === 10) {
      s = "T";
    } else if (this.rank === 11) {
      s = "J";
    } else if (this.rank === 12) {
      s = "Q";
    } else if (this.rank === 13) {
      s = "K";
    } else if (this.rank === 14) {
      s = "A";
    }

    if (suit) {
      if (this.suit === Suit.CLUB) {
        s = s + "clubs";
      } else if (this.suit === Suit.DIAMOND) {
        s = s + "diamonds";
      } else if (this.suit === Suit.HEART) {
        s = s + "hearts";
      } else if (this.suit === Suit.SPADE) {
        s = s + "spades";
      }
    }
    return s;
  }
}
