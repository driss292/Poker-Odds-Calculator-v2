import { useDroppable } from "@dnd-kit/core";
import { ICard } from "../../App";
import CardPlaceholder from "../CardPlaceholder/CardPlaceholder";
import style from "./Turn.module.css";
import Card from "../Card/Card";

type TurnCardProps = {
  turnCard: ICard[]; // Déclaration explicite du type
};

export default function Turn({ turnCard }: Readonly<TurnCardProps>) {
  const { setNodeRef } = useDroppable({
    id: `turn`,
    disabled: turnCard.length >= 1,
  });

  const items = [...turnCard, ...Array(1 - turnCard.length).fill(null)];

  return (
    <div
      ref={setNodeRef}
      className={style.cardZone}
      style={{ marginRight: "10px" }}
    >
      <span
        className={style.titleZone}
        style={{
          top: "55px",
          left: "131px",
        }}
      >
        Turn
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
