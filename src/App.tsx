import style from "./App.module.css";
import { useState } from "react";
import { dataSeat, suits } from "./utils/data";
import { generateDeck, getCardColor } from "./utils/functions";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import CardPlaceholder from "./components/CardPlaceholder/CardPlaceholder";
import Seat from "./components/Seat/Seat";
import ResetButton from "./components/ResetButton/ResetButton";
import Suit from "./components/Suit/Suit";

// Interface pour les cartes
export interface ICard {
  id: string;
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

  // Utiliser useMemo pour éviter la régénération des cartes à chaque re-render

  // Utilisation de l'état pour les informations des joueurs
  const [dataPlayerSeat, setDataPlayerSeat] = useState(initialPlayerState);
  const [deck, setDeck] = useState(generateDeck());
  const [flopCards, setFlopCards] = useState(initialFlopState);
  const [turnCard, setTurnCard] = useState(null); // La carte du turn
  const [riverCard, setRiverCard] = useState(null); // La carte de la river

  const handleDrop = (e: DragEndEvent) => {
    console.log(e.active.data);
    const newCard = e.active.data.current as ICard;
    const targetZone = e.over?.id.toString();
    console.log(newCard);

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

    // Retirer la carte du deck après qu'elle a été jouée
    // setDeck((prevDeck) => prevDeck.filter((card) => card.id !== newCard.id));

    // mettre à jour le deck
    setDeck((prevDeck) =>
      prevDeck.map((card) =>
        card.id === newCard.id ? { ...card, isPresent: false } : card
      )
    );
  };

  // Reset le jeu
  const handleReset = () => {
    setDataPlayerSeat(initialPlayerState);
    setFlopCards(initialFlopState);
    setTurnCard(null);
    setRiverCard(null);
    setDeck(generateDeck());
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
            const filteredDeck = deck.filter(
              (card) => card.suit.content === suit.content
            );
            return (
              <Suit
                key={suit.id}
                suit={suit}
                suitData={suitData}
                filteredDeck={filteredDeck}
              />
            );
          })}
        </div>
      </main>
    </DndContext>
  );
}

export default App;
