import style from "./App.module.css";
import { useMemo, useState } from "react";
import { dataSeat, suits } from "./utils/data";
import { generateCardBySuit, getCardColor } from "./utils/functions";
import Card from "./components/Card/Card";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import CardPlaceholder from "./components/CardPlaceholder/CardPlaceholder";
import Seat from "./components/Seat/Seat";
import ResetButton from "./components/ResetButton/ResetButton";

// Interface pour les cartes
export interface ICard {
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

  // Utiliser useMemo pour éviter la régénération des cartes à chaque re-render
  const cards = useMemo(() => generateCardBySuit(), []); // Appel sans argument

  const handleDrop = (e: DragEndEvent) => {
    const newCard = e.active.data.current as ICard;
    const targetZone = e.over?.id.toString();

    // console.log(newCard);
    // console.log(targetZone);

    if (!newCard || !targetZone) return;

    if (targetZone.startsWith("player")) {
      setDataPlayerSeat((prevState) => ({
        ...prevState,
        [targetZone]: {
          ...prevState[targetZone],
          cards: [...prevState[targetZone].cards, newCard],
        },
      }));
    }
  };

  const handleReset = () => {
    setDataPlayerSeat(initialPlayerState);
    setFlopCards(initialFlopState);
    setTurnCard(null);
    setRiverCard(null);
  };

  return (
    <DndContext onDragEnd={handleDrop}>
      <main className="App">
        <div className={style.table}>
          <img
            className={style.imgTable}
            src="/assets/table-poker.jpg"
            alt="poker table"
          />
          <ResetButton handleReset={handleReset} />
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
                <CardPlaceholder />
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
                <CardPlaceholder />
              )}
            </div>
          </div>

          {/* SEAT */}
          {dataSeat.map((data) => (
            <Seat key={data.id} data={data} dataPlayerSeat={dataPlayerSeat} />
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
                {cards.map((card) => (
                  <Card
                    key={`${card.id}-${card.content}`}
                    suit={suit.content}
                    value={card.content}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </main>
    </DndContext>
  );
}

export default App;
