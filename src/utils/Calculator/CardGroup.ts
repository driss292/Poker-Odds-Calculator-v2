/**
 * CardGroup
 *
 * a group of card objects
 * (typically either a player's hand, or the shared board)
 */
import * as lodash from "lodash";
import { Card } from "./Card";

export class CardGroup extends Array {
  public constructor() {
    super();
  }

  public static fromString(s: string): CardGroup {
    let tmp: string = s.replace(/[^a-z0-9]/gi, "");
    // Remplace correctement tous les "10" par "T" sans tronquer la chaîne
    tmp = tmp.replace(/10/g, "T");
    if (tmp.length % 2 !== 0) {
      throw new Error(`Invalid cards: ${s}`);
    }

    const cardgroup: CardGroup = new CardGroup();
    for (let i: number = 0; i < tmp.length; i = i + 2) {
      cardgroup.push(Card.fromString(tmp.substring(i, i + 2)));
    }
    return cardgroup;
  }

  public static fromCards(cards: Card[]): CardGroup {
    const cardgroup: CardGroup = new CardGroup();
    for (const card of cards) {
      cardgroup.push(card);
    }
    return cardgroup;
  }

  public contains(c: Card): boolean {
    for (const card of this) {
      if (card.equals(c)) {
        return true;
      }
    }
    return false;
  }

  public toString(): string {
    return "" + this.join(" ");
  }

  public sortCards(cardType: "asc" | "desc"): void {
    const sorted: Card[] = lodash.orderBy(
      this,
      ["rank", "suit"],
      [cardType, cardType]
    );
    this.splice(0, this.length, ...sorted);
  }

  public concat(cardgroup: CardGroup): CardGroup {
    const ret: CardGroup = new CardGroup();
    for (const card of this) {
      ret.push(card);
    }
    for (const card of cardgroup) {
      ret.push(card);
    }
    return ret;
  }

  public countBy(cardType: string): { [x: string]: number } {
    return lodash.countBy(this, cardType);
  }
}
