import { dataSeat, ranks, suits } from "./data";
import Spade from "../assets/spade.svg";
import Club from "../assets/club.svg";
import Heart from "../assets/heart.svg";
import Diamond from "../assets/diamond.svg";
import { ICard } from "../types/card";

export const generateDeck = () => {
  return ranks.flatMap((rank) =>
    suits.map((suit) => ({
      id: `${rank}-${suit.content}`, // id : "A-spades", "10-hearts", etc.
      suit: suit,
      content: rank,
      isPresent: true,
      zone: "deck",
    }))
  );
};

export const getCardColor = (suit: string): { src: string; color: string } => {
  const cardColors: Record<string, { src: string; color: string }> = {
    spades: { src: Spade, color: "" },
    clubs: { src: Club, color: "" },
    diamonds: { src: Diamond, color: "redCard" },
    hearts: { src: Heart, color: "redCard" },
  };

  // Retourne la valeur correspondante ou une valeur par défaut
  return cardColors[suit] ?? { src: Spade, color: "" }; // Spade comme fallback
};

export const initialPlayerState = dataSeat.reduce((acc, seat) => {
  acc[`player${seat.id}`] = {
    cards: [], // Pas de cartes pour le moment
    posX: seat.posX,
    posY: seat.posY,
    score: 0, // Score à 0 par défaut
  };
  return acc;
}, {} as { [key: string]: { cards: ICard[]; posX: number; posY: number; score: number } });

export const formatCard = (card: string) => {
  const arrayOfCard = card.split("-");
  const value = arrayOfCard[0];
  const suit = arrayOfCard[1].charAt(0);

  return `${value}${suit}`;
};
