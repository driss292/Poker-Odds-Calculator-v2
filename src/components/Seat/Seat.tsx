import { useDroppable } from "@dnd-kit/core";
import { ICard } from "../../App";
import CardPlaceholder from "../CardPlaceholder/CardPlaceholder";
import style from "./Seat.module.css";

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
  console.log(dataPlayerSeat);
  const { setNodeRef } = useDroppable({
    id: data.id,
  });
  const playerId = `player${data.id}`;
  const playerScore =
    dataPlayerSeat[playerId].score === 0
      ? "00.00"
      : `${dataPlayerSeat[playerId].score}`;
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
      <div className={style.id}>player {data.id}</div>
      <div className={style.cardContainer}>
        <CardPlaceholder />
        <CardPlaceholder />
      </div>
      <div className={style.score}>{playerScore}%</div>
    </div>
  );
}
