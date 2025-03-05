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
import {
  formatCard,
  generateDeck,
  initialPlayerState,
} from "./utils/functions";
import StartAnalysis from "./components/StartAnalysis/StartAnalysis";
import { OddsCalculator } from "./utils/Calculator/OddsCalculator";
import { CardGroup } from "./utils/Calculator/CardGroup";

function App() {
  // Utilisation de l'état pour les informations des joueurs
  const [dataPlayerSeat, setDataPlayerSeat] = useState(initialPlayerState);
  const [deck, setDeck] = useState(generateDeck());
  const [flopCards, setFlopCards] = useState<ICard[]>([]);
  const [turnCard, setTurnCard] = useState<ICard[]>([]);
  const [riverCard, setRiverCard] = useState<ICard[]>([]);
  // const [shouldResetScores, setShouldResetScores] = useState(false);

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

    // Indiquer que les scores doivent être réinitialisés
    // setShouldResetScores(true);
  };

  const isAnalysisEnabled = useMemo(() => {
    const playerSeatsArray = Object.values(dataPlayerSeat);
    const filledSeats = playerSeatsArray.filter(
      (seat) => seat.cards && seat.cards.length === 2
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
    // Création d'une correspondance entre les joueurs et leurs indices
    const playerEntries = Object.entries(dataPlayerSeat).filter(
      ([, seat]) => seat.cards.length > 0
    );

    const playerHands = playerEntries.map(([, seat]) => {
      const card1 = formatCard(seat.cards[0].id);
      const card2 = formatCard(seat.cards[1].id);
      const playerHand = [...card1, ...card2].join("");

      return CardGroup.fromString(playerHand);
    });

    const communityCards = [...flopCards, ...turnCard, ...riverCard]
      .map((card) => formatCard(card.id))
      .join("");

    const board = CardGroup.fromString(communityCards);

    const result = OddsCalculator.calculate(playerHands, board);

    // Mise à jour des scores en gardant l'association correcte avec les joueurs
    setDataPlayerSeat((prevState) => {
      const newState = { ...prevState };

      playerEntries.forEach(([playerKey], index) => {
        newState[playerKey] = {
          ...newState[playerKey],
          score: result.equities[index].getEquity(), // Utilisation de l'index dans le bon ordre
        };
      });

      return newState;
    });
  };

  // Reset le jeu
  const handleReset = () => {
    setDataPlayerSeat(initialPlayerState);
    setFlopCards([]);
    setTurnCard([]);
    setRiverCard([]);
    setDeck(generateDeck());
  };

  // Nettoyer le composant lorsque les cartes d'un siège changent
  // useEffect(() => {
  //   if (shouldResetScores) {
  //     setDataPlayerSeat((prevState) => {
  //       const updatedState = { ...prevState };
  //       Object.keys(updatedState).forEach((key) => {
  //         updatedState[key].score = 0;
  //       });
  //       return updatedState;
  //     });
  //   }
  //   setShouldResetScores(false);
  // }, [shouldResetScores]);

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
