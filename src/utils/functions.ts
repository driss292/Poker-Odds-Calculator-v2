import { ranks } from "./data";
import Spade from "../assets/spade.svg";
import Club from "../assets/club.svg";
import Heart from "../assets/heart.svg";
import Diamond from "../assets/diamond.svg";

export const generateCardBySuit = () => {
  return ranks.map((rank) => ({ id: `${rank}`, content: rank }));
};

export const getCardColor = (
  suit: string
): { src: string; color: string } | null => {
  switch (suit) {
    case "spades":
      return {
        src: Spade,
        color: "",
      };
    case "clubs":
      return {
        src: Club,
        color: "",
      };
    case "diamonds":
      return {
        src: Diamond,
        color: "redCard",
      };
    case "hearts":
      return {
        src: Heart,
        color: "redCard",
      };
    default:
      return null;
  }
};
