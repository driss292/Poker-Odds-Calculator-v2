import { useDroppable } from "@dnd-kit/core";
import { ICard } from "../../App";
import CardPlaceholder from "../CardPlaceholder/CardPlaceholder";
import style from "./River.module.css";
import Card from "../Card/Card";

type riverCardProps = {
  riverCard: ICard[]; // Déclaration explicite du type
};

export default function River({ riverCard }: Readonly<riverCardProps>) {
  const { setNodeRef } = useDroppable({
    id: `river`,
    disabled: riverCard.length >= 1,
  });

  const items = [...riverCard, ...Array(1 - riverCard.length).fill(null)];
  return (
    <div ref={setNodeRef} className={style.cardZone}>
      <span
        className={style.titleZone}
        style={{
          top: "55px",
          left: "175px",
        }}
      >
        River
      </span>
      {items.map((card, index) => (
        <div
          key={`turn-${index}-${card?.value ?? "empty"}`} // Clé sécurisée
          style={{ marginLeft: index > 0 ? "5px" : "0px" }}
          className={card ? style.cardPlaceholderOfCard : style.cardPlaceholder}
        >
          {card ? (
            <Card suit={card.suit} value={card.value} zone={card.zone} />
          ) : (
            <CardPlaceholder />
          )}
        </div>
      ))}
    </div>
  );
}
