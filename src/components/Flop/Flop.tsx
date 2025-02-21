import { ICard } from "../../App";
import CardPlaceholder from "../CardPlaceholder/CardPlaceholder";
import style from "./Flop.module.css";

type FlopCardProps = {
  flopCards: { [key: string]: ICard | null }; // Déclaration explicite du type
};

export default function Flop({ flopCards }: Readonly<FlopCardProps>) {
  console.log(flopCards);
  // Filtrer les cartes nulles avant de passer à Object.entries
  const filteredFlopCards = Object.entries(flopCards).filter(
    ([card]) => card !== null
  );
  return (
    <div
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
      {filteredFlopCards.map(([key, card], index) => (
        <div
          key={key}
          style={{ marginLeft: index > 0 ? "5px" : "0px" }}
          className={card ? style.cardPlaceholderOfCard : style.cardPlaceholder}
        >
          {/* Si la carte existe, on l'affiche, sinon on affiche un placeholder */}
          {card ? (
            <div className={style.cardDisplay}>
              <span>
                {card.suit} {card.value}
              </span>{" "}
            </div>
          ) : (
            <CardPlaceholder />
          )}
        </div>
      ))}
    </div>
  );
}
