import style from "./App.module.css";
import { useState } from "react";
import { dataSeat } from "./utils/data";
import { generateDeck } from "./utils/functions";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Seat from "./components/Seat/Seat";
import ResetButton from "./components/ResetButton/ResetButton";
import Deck from "./components/Deck/Deck";
import Flop from "./components/Flop/Flop";
import Turn from "./components/Turn/Turn";
import River from "./components/River/River";

// Interface pour les cartes
export interface ICard {
  id: string;
  value: string; // La valeur de la carte, par exemple 'A', '10', etc.
  suit: string; // La couleur de la carte, par exemple 'hearts', 'diamonds'
  src: string; // Le chemin de l'image de la carte, par exemple '/images/ace_of_hearts.png'
  zone: string; // Le nom de la zone d'origine de la carte
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

  // Utilisation de l'état pour les informations des joueurs
  const [dataPlayerSeat, setDataPlayerSeat] = useState(initialPlayerState);
  const [deck, setDeck] = useState(generateDeck());
  const [flopCards, setFlopCards] = useState<ICard[]>([]);
  const [turnCard, setTurnCard] = useState<ICard[]>([]); // La carte du turn
  const [riverCard, setRiverCard] = useState<ICard[]>([]); // La carte de la river

  const handleDrop = (e: DragEndEvent) => {
    const newCard = e.active.data.current as ICard;
    const targetZone = e.over?.id.toString();
    const sourceZone = e.active.data.current?.origin; // La zone d'origine de l'élément

    console.log(e.active.data);
    console.log("===> TARGET ZONE", targetZone);
    console.log("===> NEW CARD", newCard);
    console.log("===> SOURCE ZONE", sourceZone);

    if (!newCard || !targetZone) return;

    if (targetZone.startsWith("player")) {
      setDataPlayerSeat((prevState) => {
        const playerCards = prevState[targetZone].cards;

        // Vérifier si la carte est déjà présente dans le seat
        const isAlreadyInSeat = playerCards.some(
          (card) => card.id === newCard.id
        );

        if (isAlreadyInSeat) {
          return prevState; // Ne rien modifier si la carte est déjà là
        }

        return {
          ...prevState,
          [targetZone]: {
            ...prevState[targetZone],
            cards: [
              ...playerCards,
              { ...newCard, zone: targetZone }, // Ajouter la propriété 'zone' ici
            ],
          },
        };
      });

      // mettre à jour le deck
      setDeck((prevDeck) =>
        prevDeck.map((card) =>
          card.id === newCard.id
            ? { ...card, isPresent: false, zone: targetZone }
            : card
        )
      );
    }

    if (targetZone === "flop" && sourceZone !== "flop" && newCard) {
      setFlopCards((prevState) => {
        // Vérifier si la carte est déjà présente dans le flop
        const isAlreadyInFlop = prevState.some(
          (card) => card.id === newCard.id
        );

        if (isAlreadyInFlop) {
          return prevState; // Ne rien modifier si la carte est déjà là
        }

        return [...prevState, { ...newCard, zone: targetZone }];
      });

      // mettre à jour le deck
      setDeck((prevDeck) =>
        prevDeck.map((card) =>
          card.id === newCard.id
            ? { ...card, isPresent: false, zone: targetZone }
            : card
        )
      );
    }

    if (targetZone === "deck" && sourceZone !== "deck" && newCard) {
      setDeck((prevDeck) =>
        prevDeck.map((card) =>
          card.id === newCard.id
            ? { ...card, isPresent: true, zone: sourceZone }
            : card
        )
      );

      setDataPlayerSeat((prevState) => ({
        ...prevState,
        [sourceZone]: {
          ...prevState[sourceZone],
          cards: prevState[sourceZone].cards.filter(
            (card) => card.id !== newCard.id // Suppression de la carte par son 'id'
          ),
        },
      }));
    }
  };

  // Reset le jeu
  const handleReset = () => {
    setDataPlayerSeat(initialPlayerState);
    setFlopCards([]);
    setTurnCard([]);
    setRiverCard([]);
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
            <Flop flopCards={flopCards} />

            {/* Turn */}
            <Turn turnCard={turnCard} />
            {/* <div className={style.cardZone} style={{ marginRight: "10px" }}>
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
            </div> */}

            {/* River */}
            <River riverCard={riverCard} />
            {/* <div className={style.cardZone}>
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
            */}
          </div>

          {/* SEAT */}
          {dataSeat.map((data) => (
            <Seat key={data.id} data={data} dataPlayerSeat={dataPlayerSeat} />
          ))}
        </div>

        {/* DECK */}
        <Deck deck={deck} />
      </main>
    </DndContext>
  );
}

export default App;
