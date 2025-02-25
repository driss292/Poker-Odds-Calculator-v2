import { useDroppable } from "@dnd-kit/core";
import { ICard } from "../../App";
import CardPlaceholder from "../CardPlaceholder/CardPlaceholder";
import style from "./Flop.module.css";
import Card from "../Card/Card";

type FlopCardProps = {
  flopCards: ICard[]; // Déclaration explicite du type
};

export default function Flop({ flopCards }: Readonly<FlopCardProps>) {
  const { setNodeRef } = useDroppable({
    id: `flop`,
    disabled: flopCards.length >= 3,
  });

  const items = [...flopCards, ...Array(3 - flopCards.length).fill(null)];

  return (
    <div
      ref={setNodeRef}
      className={style.cardZone}
      style={{ display: "flex", marginRight: "10px" }}
    >
      <span
        className={style.titleZone}
        style={{
          top: "55px",
          left: "47px",
        }}
      >
        Flop
      </span>
      {items.map((card, index) => (
        <div
          key={`flop-${index}-${card?.value ?? "empty"}`} // Clé sécurisée
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
