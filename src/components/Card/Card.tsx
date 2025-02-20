import { useDraggable } from "@dnd-kit/core";
import { getCardColor } from "../../utils/functions";
import { CSS } from "@dnd-kit/utilities";
import style from "./Card.module.css";

type CardProps = {
  readonly suit: string;
  readonly value: string;
};

export default function Card({ suit, value }: CardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${suit}-${value}`,
    data: { suit, value, id: `${suit}-${value}` },
  });
  const cardColor = getCardColor(suit);
  if (!cardColor) {
    console.error(`Invalid suit provided: ${suit}`);
    return null;
  }

  const { src, color } = cardColor;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...attributes}
      {...listeners}
      className={style.card}
    >
      <p className={`${style.value} ${style[color]}`}>{value}</p>
      <img className={style.suit} src={src} alt={suit} />
    </div>
  );
}
