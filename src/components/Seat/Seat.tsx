import { useDroppable } from "@dnd-kit/core";
import { ICard } from "../../App";
import CardPlaceholder from "../CardPlaceholder/CardPlaceholder";
import style from "./Seat.module.css";
import Card from "../Card/Card";

type SeatProps = {
  readonly data: {
    id: number;
    posX: number;
    posY: number;
  };
  readonly dataPlayerSeat: {
    [key: string]: {
      cards: ICard[];
      posX: number;
      posY: number;
      score: number;
    };
  };
};

export default function Seat({ data, dataPlayerSeat }: SeatProps) {
  const playerId = `player${data.id}`;
  const playerScore =
    dataPlayerSeat[playerId].score === 0
      ? "00.00"
      : `${dataPlayerSeat[playerId].score}`;

  const cards = dataPlayerSeat[playerId].cards;

  const { setNodeRef } = useDroppable({
    id: `player${data.id}`,
    disabled: cards.length >= 2,
  });

  const items = [...cards, ...Array(2 - cards.length).fill(null)];

  return (
    <div
      ref={setNodeRef}
      key={data.id}
      id={playerId}
      className={style.seat}
      style={{
        left: `${data.posX}px`,
        top: `${data.posY}px`,
      }}
    >
      <div className={style.id}>{playerId}</div>
      <div className={style.cardContainer}>
        {items.map((card, index) =>
          card ? (
            <Card
              key={`${card.suit}-${card.value}`}
              suit={card.suit}
              value={card.value}
              zone={card.zone}
            />
          ) : (
            <CardPlaceholder key={`${index}-${card}`} />
          )
        )}
      </div>
      <div className={style.score}>{playerScore}%</div>
    </div>
  );
}
