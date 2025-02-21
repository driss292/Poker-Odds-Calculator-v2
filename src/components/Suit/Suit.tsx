import Card from "../Card/Card";
import DeckPlaceholder from "../DeckPlaceholder/DeckPlaceholder";
import IconDeck from "../IconDeck/IconDeck";
import style from "./Suit.module.css";

type CardType = {
  id: string;
  suit: {
    id: number;
    content: string;
  };
  content: string;
  isPresent: boolean;
  zone: string;
};

type Props = {
  suit: { id: number; content: string };
  suitData: { src: string; color: string };
  filteredDeck: CardType[];
};

export default function Suit({
  suit,
  suitData,
  filteredDeck,
}: Readonly<Props>) {
  // console.log(filteredDeck);
  return (
    <div key={suit.id} className={style.suits}>
      <div className={`${style.block} ${suitData?.color ?? ""}`}>
        {suitData && <IconDeck src={suitData.src} alt={suit.content} />}
      </div>
      {filteredDeck.map((card) =>
        card.isPresent ? (
          <Card
            key={`${card.id}`}
            suit={card.suit.content}
            value={card.content}
            zone={card.zone}
          />
        ) : (
          <DeckPlaceholder
            key={card.id}
            suit={card.suit.content}
            value={card.content}
          />
        )
      )}
    </div>
  );
}
