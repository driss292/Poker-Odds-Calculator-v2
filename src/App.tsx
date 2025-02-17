import { RiResetLeftFill } from "react-icons/ri";
import style from "./App.module.css";
import { useMemo, useState } from "react";
import { dataSeat, suits } from "./utils/data";
import { generateCardBySuit, getCardColor } from "./utils/functions";

// Interface pour les cartes
interface ICard {
  value: string; // La valeur de la carte, par exemple 'A', '10', etc.
  suit: string; // La couleur de la carte, par exemple 'hearts', 'diamonds'
  src: string; // Le chemin de l'image de la carte, par exemple '/images/ace_of_hearts.png'
}

function App() {
  // Initialisation de l'état des joueurs
  const initialPlayerState = dataSeat.reduce((acc, seat) => {
    acc[`player${seat.id}`] = {
      cards: [], // Pas de cartes pour le moment
      posX: seat.posX,
      posY: seat.posY,
      score: 0, // Score à 0 par défaut
    };
    return acc;
  }, {} as { [key: string]: { cards: ICard[]; posX: number; posY: number; score: number } });

  const initialFlopState = {
    "flop-1": null,
    "flop-2": null,
    "flop-3": null,
  } as { [key: string]: ICard | null };

  // Utilisation de l'état pour les informations des joueurs
  const [dataPlayerSeat, setDataPlayerSeat] = useState(initialPlayerState);
  const [flopCards, setFlopCards] = useState(initialFlopState);
  const [turnCard, setTurnCard] = useState(null); // La carte du turn
  const [riverCard, setRiverCard] = useState(null); // La carte de la river

  // const cardColor = getCardColor(suit);
  // if (!cardColor) {
  //   console.error(`Invalid suit provided: ${suit}`);
  //   return null;
  // }

  // const { src, color } = cardColor;

  // Utiliser useMemo pour éviter la régénération des cartes à chaque re-render
  // const cards = useMemo(() => generateCardBySuit(), []); // Appel sans argument

  //     // Récupérer les données de la couleur et du symbole pour chaque suit
  // const suitData = getCardColor(suit);

  return (
    <main className="App">
      <div className={style.table}>
        <img
          className={style.imgTable}
          src="/assets/table-poker.jpg"
          alt="poker table"
        />
        <div
          style={{
            position: "absolute",
            bottom: "225px",
            left: "30px",
            color: "white",
            cursor: "pointer",
          }}
          // onClick={onReset}
        >
          <span
            style={{
              fontSize: "15px",
              position: "absolute",
              left: "0px",
              bottom: "-10px",
            }}
          >
            Reset
          </span>
          <RiResetLeftFill style={{ fontSize: "40px" }} />
        </div>
        {/* BOARD */}
        <div className={style.boardContainer}>
          {/* Flop */}
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
            {Object.entries(flopCards).map(([key, card], index) => (
              <div
                key={key}
                style={{ marginLeft: index > 0 ? "5px" : "0px" }}
                className={
                  card ? style.cardPlaceholderOfCard : style.cardPlaceholder
                }
              ></div>
            ))}
          </div>

          {/* Turn */}
          <div className={style.cardZone} style={{ marginRight: "10px" }}>
            <span
              className={style.titleZone}
              style={{
                top: "55px",
                left: "131px",
              }}
            >
              Turn
            </span>
            {turnCard ? (
              <div className={style.cardPlaceholderOfCard}></div>
            ) : (
              <div className={style.cardPlaceholder}></div>
            )}
          </div>

          {/* River */}
          <div className={style.cardZone}>
            <span
              className={style.titleZone}
              style={{
                top: "55px",
                left: "175px",
              }}
            >
              River
            </span>
            {riverCard ? (
              <div className={style.cardPlaceholderOfCard}></div>
            ) : (
              <div className={style.cardPlaceholder}></div>
            )}
          </div>
        </div>

        {/* SEAT */}
        {dataSeat.map((data) => (
          <div
            key={data.id}
            id={`player-${data.id}`}
            className={style.seat}
            style={{
              left: `${data.posX}px`,
              top: `${data.posY}px`,
            }}
          >
            <div className={style.id}>player {data.id}</div>
            <div className={style.cardContainer}>
              {/* Placeholders pour les cartes */}
              <div className={style.cardPlaceholder}></div>
              <div className={style.cardPlaceholder}></div>
            </div>
            <div className={style.score}>
              {dataPlayerSeat[`player${data.id}`].score === 0
                ? "00.00"
                : `${dataPlayerSeat[`player${data.id}`].score}`}
              %
            </div>
          </div>
        ))}
      </div>

      {/* DECK */}
      <div className={style.deck}>
        {suits.map((suit) => {
          const suitData = getCardColor(suit.content);
          return (
            <div key={suit.id} className={style.suits}>
              <div className={`${style.block} ${suitData?.color ?? ""}`}>
                {suitData && (
                  <img
                    src={suitData.src}
                    alt={suit.content}
                    className={style.symbol}
                  />
                )}
              </div>
              {/* {cards.map((card) => {
                const cardColor = getCardColor(card.suit);
                return (
                  <div
                    key={`${card.suit}-${card.value}`}
                    className={style.card}
                  >
                    <p className={`${style.value} ${cardColor?.color ?? ""}`}>
                      {card.value}
                    </p>
                    <img
                      className={style.suit}
                      src={cardColor?.src ?? ""}
                      alt={card.suit}
                    />
                  </div>
                );
              })} */}
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default App;
