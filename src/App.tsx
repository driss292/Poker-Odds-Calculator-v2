import style from "./App.module.css";
import { useMemo, useState } from "react";
import { dataSeat } from "./utils/data";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Seat from "./components/Seat/Seat";
import ResetButton from "./components/ResetButton/ResetButton";
import Deck from "./components/Deck/Deck";
import Flop from "./components/Flop/Flop";
import Turn from "./components/Turn/Turn";
import River from "./components/River/River";
import ImageTable from "./components/ImageTable/ImageTable";
import { ICard } from "./types/card";
import { generateDeck, initialPlayerState } from "./utils/functions";
import StartAnalysis from "./components/StartAnalysis/StartAnalysis";

function App() {
  // Utilisation de l'état pour les informations des joueurs
  const [dataPlayerSeat, setDataPlayerSeat] = useState(initialPlayerState);
  const [deck, setDeck] = useState(generateDeck());
  const [flopCards, setFlopCards] = useState<ICard[]>([]);
  const [turnCard, setTurnCard] = useState<ICard[]>([]);
  const [riverCard, setRiverCard] = useState<ICard[]>([]);

  const updateDeck = (newCard: ICard, zone: string, isPresent: boolean) => {
    setDeck((prevDeck) =>
      prevDeck.map((card) =>
        card.id === newCard.id
          ? { ...card, isPresent: isPresent, zone: zone }
          : card
      )
    );
  };

  const removeCardFromSource = (card: ICard, sourceZone: string) => {
    if (sourceZone.startsWith("player")) {
      setDataPlayerSeat((prevState) => ({
        ...prevState,
        [sourceZone]: {
          ...prevState[sourceZone],
          cards: prevState[sourceZone].cards.filter((c) => c.id !== card.id),
        },
      }));
    } else if (sourceZone === "flop") {
      setFlopCards((prevState) => prevState.filter((c) => c.id !== card.id));
    } else if (sourceZone === "turn") {
      setTurnCard((prevState) => prevState.filter((c) => c.id !== card.id));
    } else if (sourceZone === "river") {
      setRiverCard((prevState) => prevState.filter((c) => c.id !== card.id));
    }
  };

  const handleDrop = (e: DragEndEvent) => {
    const newCard = e.active.data.current as ICard;
    const targetZone = e.over?.id.toString();
    const sourceZone = e.active.data.current?.origin;

    if (!newCard || !targetZone) return;

    if (targetZone.startsWith("player")) {
      removeCardFromSource(newCard, sourceZone);

      setDataPlayerSeat((prevState) => {
        const playerCards = prevState[targetZone].cards;

        const isAlreadyInSeat = playerCards.some(
          (card) => card.id === newCard.id
        );

        if (isAlreadyInSeat) {
          return prevState;
        }

        return {
          ...prevState,
          [targetZone]: {
            ...prevState[targetZone],
            cards: [...playerCards, { ...newCard, zone: targetZone }],
          },
        };
      });
      updateDeck(newCard, targetZone, false);
    }

    if (targetZone === "flop" && newCard) {
      removeCardFromSource(newCard, sourceZone);
      setFlopCards((prevState) => [
        ...prevState,
        { ...newCard, zone: targetZone },
      ]);
      updateDeck(newCard, targetZone, false);
    }

    if (targetZone === "turn" && newCard) {
      removeCardFromSource(newCard, sourceZone);
      setTurnCard((prevState) => [
        ...prevState,
        { ...newCard, zone: targetZone },
      ]);
      updateDeck(newCard, targetZone, false);
    }

    if (targetZone === "river" && newCard) {
      removeCardFromSource(newCard, sourceZone);
      setRiverCard((prevState) => [
        ...prevState,
        { ...newCard, zone: targetZone },
      ]);
      updateDeck(newCard, targetZone, false);
    }

    if (targetZone === "deck" && sourceZone !== "deck" && newCard) {
      removeCardFromSource(newCard, sourceZone);
      updateDeck(newCard, sourceZone, true);
    }
  };

  const isAnalysisEnabled = useMemo(() => {
    const playerSeatsArray = Object.values(dataPlayerSeat);
    const filledSeats = playerSeatsArray.filter(
      (seat) => seat.cards.length === 2
    );
    const occupiedSeats = playerSeatsArray.filter(
      (seat) => seat.cards.length > 0
    );

    const hasMinPlayers = filledSeats.length >= 2;
    const allPlayersComplete = filledSeats.length === occupiedSeats.length;

    const isFlopValid = flopCards.length === 0 || flopCards.length === 3;

    return (
      hasMinPlayers &&
      (filledSeats.length === 2 || allPlayersComplete) &&
      isFlopValid
    );
  }, [dataPlayerSeat, flopCards]);

  const isResetEnabled = useMemo(() => {
    const playerSeatsArray = Object.values(dataPlayerSeat);
    return playerSeatsArray.some((playerSeat) => playerSeat.cards.length > 0);
  }, [dataPlayerSeat]);

  const handleStartAnalisis = () => {
    console.log("start");
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
        <div>
          <StartAnalysis
            isAnalysisEnabled={isAnalysisEnabled}
            handleStartAnalisis={handleStartAnalisis}
          />
          <ImageTable />
          <ResetButton
            isResetEnabled={isResetEnabled}
            handleReset={handleReset}
          />

          {/* BOARD */}
          <div className={style.boardContainer}>
            <Flop flopCards={flopCards} />
            <Turn turnCard={turnCard} />
            <River riverCard={riverCard} />
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
