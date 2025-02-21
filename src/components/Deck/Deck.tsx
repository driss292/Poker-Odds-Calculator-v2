import { suits } from "../../utils/data";
import { getCardColor } from "../../utils/functions";
import Suit from "../Suit/Suit";
import style from "./Deck.module.css";

type CardType = {
  id: string;
  suit: {
    id: number;
    content: string;
  };
  content: string;
  isPresent: boolean;
};

export default function Deck({ deck }: Readonly<{ deck: CardType[] }>) {
  return (
    <div className={style.deck}>
      {suits.map((suit) => {
        const suitData = getCardColor(suit.content);
        const filteredDeck = deck.filter(
          (card) => card.suit.content === suit.content
        );
        return (
          <Suit
            key={suit.id}
            suit={suit}
            suitData={suitData}
            filteredDeck={filteredDeck}
          />
        );
      })}
    </div>
  );
}
