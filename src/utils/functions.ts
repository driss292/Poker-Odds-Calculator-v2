import { ranks, suits } from "./data";
import Spade from "../assets/spade.svg";
import Club from "../assets/club.svg";
import Heart from "../assets/heart.svg";
import Diamond from "../assets/diamond.svg";

export const generateCardBySuit = (suit: string) => {
  return ranks.map((rank) => ({
    id: `${rank}-${suit}`, // id : "A-spades", "10-hearts", etc.
    suit,
    content: rank,
  }));
};

export const generateDeck = () => {
  return ranks.flatMap((rank) =>
    suits.map((suit) => ({
      id: `${suit.content}-${rank}`, // id : "A-spades", "10-hearts", etc.
      suit: suit,
      content: rank,
      isPresent: true,
    }))
  );
};

// export const getCardColor = (
//   suit: string
// ): { src: string; color: string } | null => {
//   switch (suit) {
//     case "spades":
//       return {
//         src: Spade,
//         color: "",
//       };
//     case "clubs":
//       return {
//         src: Club,
//         color: "",
//       };
//     case "diamonds":
//       return {
//         src: Diamond,
//         color: "redCard",
//       };
//     case "hearts":
//       return {
//         src: Heart,
//         color: "redCard",
//       };
//     default:
//       return null;
//   }
// };

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
