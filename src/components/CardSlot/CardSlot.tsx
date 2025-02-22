import { useDroppable } from "@dnd-kit/core";
import style from "./CardSlot.module.css";
import { ICard } from "../../App";
import Card from "../Card/Card";
import CardPlaceholder from "../CardPlaceholder/CardPlaceholder";

type CardSlotProps = { zoneId: string; index: number; card: ICard | null };

export default function CardSlot({
  card,
  zoneId,
  index,
}: Readonly<CardSlotProps>) {
  const { setNodeRef } = useDroppable({
    id: `${zoneId}-slot-${index}`,
    disabled: card !== null, // Désactive le drop si une carte est présente
  });
  return (
    <div ref={setNodeRef} className={style.cardSlot}>
      {card ? (
        <Card
          key={`${card.suit}-${card.value}`}
          suit={card.suit}
          value={card.value}
          zone={card.zone}
        />
      ) : (
        <CardPlaceholder />
      )}
    </div>
  );
}
