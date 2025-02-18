import { getCardColor } from "../../utils/functions";
import style from "./Card.module.css";

type CardProps = {
  readonly suit: string;
  readonly value: string;
};

export default function Card({ suit, value }: CardProps) {
  const cardColor = getCardColor(suit);
  if (!cardColor) {
    console.error(`Invalid suit provided: ${suit}`);
    return null;
  }

  const { src, color } = cardColor;

  return (
    <div className={style.card}>
      <p className={`${style.value} ${style[color]}`}>{value}</p>
      <img className={style.suit} src={src} alt={suit} />
    </div>
  );
}
