// pokerAlgo.ts

const SUITS = ["hearts", "diamonds", "clubs", "spades"] as const;
const VALUES = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
] as const;

export type Suit = (typeof SUITS)[number];
export type Value = (typeof VALUES)[number];

// Classe Card pour représenter une carte
export class Card {
  constructor(public value: Value, public suit: Suit) {}
}

// Classe Deck pour représenter un jeu de cartes
export class Deck {
  private cards: Card[];

  constructor() {
    this.cards = [];
    for (const suit of SUITS) {
      for (const value of VALUES) {
        this.cards.push(new Card(value, suit));
      }
    }
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  deal(n: number) {
    return this.cards.splice(0, n);
  }

  getCards(): Card[] {
    return this.cards;
  }

  removeCards(cardsToRemove: Card[]) {
    this.cards = this.cards.filter(
      (card) =>
        !cardsToRemove.some(
          (c) => c.value === card.value && c.suit === card.suit
        )
    );
  }
}

// Interface pour structurer les résultats d'une main
export interface HandEvaluation {
  type: string;
  strength: number;
  highCard?: number;
  highCards?: number[];
  triple?: number;
  pair?: number;
  kickers?: number[];
  quad?: number;
  highPair?: number;
  lowPair?: number;
}

// Fonction pour évaluer une main
export function evaluateHand(hand: Card[]): HandEvaluation {
  const ranks = hand.map((card) => VALUES.indexOf(card.value));
  const suits = hand.map((card) => card.suit);

  // Trier les rangs par ordre décroissant
  ranks.sort((a, b) => b - a);

  // Vérifier la couleur (flush)
  const flushSuit = suits.filter(
    (suit, _, arr) => arr.filter((s) => s === suit).length >= 5
  )[0];
  const flushCards = hand
    .filter((card) => card.suit === flushSuit)
    .map((card) => VALUES.indexOf(card.value))
    .sort((a, b) => b - a);
  const isFlush = flushCards.length >= 5;

  // Vérifier la suite (straight)
  const uniqueRanks = [...new Set(ranks)];
  let isStraight = false;
  let straightHighCard = null;

  for (let i = 0; i <= uniqueRanks.length - 5; i++) {
    if (uniqueRanks[i] - uniqueRanks[i + 4] === 4) {
      isStraight = true;
      straightHighCard = uniqueRanks[i];
      break;
    }
  }
  // Cas spécial pour A-2-3-4-5
  if (
    uniqueRanks.includes(12) &&
    uniqueRanks.slice(-4).toString() === [0, 1, 2, 3].toString()
  ) {
    isStraight = true;
    straightHighCard = 3; // Le 5 dans une suite basse
  }

  const isStraightFlush =
    isFlush &&
    flushCards
      .slice(0, 5)
      .every((rank, i, arr) => i === 0 || rank === arr[i - 1] - 1);
  const isRoyalFlush = isStraightFlush && flushCards[0] === 12;

  // Compter les occurrences de chaque rang
  const rankCounts: Record<number, number> = ranks.reduce((acc, rank) => {
    acc[rank] = (acc[rank] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const counts = Object.values(rankCounts).sort((a, b) => b - a);

  // Évaluer la main
  if (isRoyalFlush) return { type: "Royal Flush", strength: 10 };
  if (isStraightFlush)
    return { type: "Straight Flush", strength: 9, highCard: flushCards[0] };
  if (counts[0] === 4)
    return {
      type: "Four of a Kind",
      strength: 8,
      quad: ranks.find((r) => rankCounts[r] === 4),
    };
  if (counts[0] === 3 && counts[1] === 2)
    return {
      type: "Full House",
      strength: 7,
      triple: ranks.find((r) => rankCounts[r] === 3),
      pair: ranks.find((r) => rankCounts[r] === 2),
    };
  if (isFlush)
    return { type: "Flush", strength: 6, highCards: flushCards.slice(0, 5) };
  if (isStraight)
    return { type: "Straight", strength: 5, highCard: straightHighCard! };
  if (counts[0] === 3)
    return {
      type: "Three of a Kind",
      strength: 4,
      triple: ranks.find((r) => rankCounts[r] === 3),
      kickers: ranks.filter((r) => rankCounts[r] === 1).slice(0, 2),
    };
  if (counts[0] === 2 && counts[1] === 2)
    return {
      type: "Two Pair",
      strength: 3,
      highPair: Math.max(...ranks.filter((r) => rankCounts[r] === 2)),
      lowPair: Math.min(...ranks.filter((r) => rankCounts[r] === 2)),
      kickers: [ranks.find((r) => rankCounts[r] === 1)!],
    };
  if (counts[0] === 2)
    return {
      type: "One Pair",
      strength: 2,
      pair: ranks.find((r) => rankCounts[r] === 2),
      kickers: ranks.filter((r) => rankCounts[r] === 1).slice(0, 3),
    };
  return { type: "High Card", strength: 1, highCards: ranks.slice(0, 5) };
}

// Fonction pour comparer deux mains
export function compareHands(hand1: Card[], hand2: Card[]) {
  const eval1 = evaluateHand(hand1);
  const eval2 = evaluateHand(hand2);

  // Comparaison des forces de mains
  if (eval1.strength > eval2.strength) {
    return 1; // eval1 est plus fort
  } else if (eval1.strength < eval2.strength) {
    return -1; // eval2 est plus fort
  }

  // En cas d'égalité, comparer les cartes hautes ou les kickers
  switch (eval1.type) {
    case "Royal Flush":
      return 0; // Royal Flush gagne toujours, mais ici c'est une égalité
    case "Straight Flush":
    case "Straight":
      if (eval1.highCard! !== eval2.highCard!) {
        return eval1.highCard! - eval2.highCard!;
      }
      return 0;
    case "Four of a Kind": {
      if (eval1.quad !== eval2.quad) return eval1.quad! - eval2.quad!;
      const kicker1 = Math.max(
        ...hand1
          .map((c) => VALUES.indexOf(c.value))
          .filter((r) => r !== eval1.quad)
      );
      const kicker2 = Math.max(
        ...hand2
          .map((c) => VALUES.indexOf(c.value))
          .filter((r) => r !== eval2.quad)
      );
      return kicker1 - kicker2;
    }
    case "Full House":
      if (eval1.triple !== eval2.triple) return eval1.triple! - eval2.triple!;
      return eval1.pair! - eval2.pair!;
    case "Flush":
    case "High Card":
      for (let i = 0; i < 5; i++) {
        if (eval1.highCards![i] !== eval2.highCards![i])
          return eval1.highCards![i] - eval2.highCards![i];
      }
      return 0;
    case "Three of a Kind":
      if (eval1.triple !== eval2.triple) return eval1.triple! - eval2.triple!;
      for (let i = 0; i < 2; i++) {
        if (eval1.kickers![i] !== eval2.kickers![i])
          return eval1.kickers![i] - eval2.kickers![i];
      }
      return 0;
    case "Two Pair":
      if (eval1.highPair !== eval2.highPair)
        return eval1.highPair! - eval2.highPair!;
      if (eval1.lowPair !== eval2.lowPair)
        return eval1.lowPair! - eval2.lowPair!;
      return eval1.kickers![0] - eval2.kickers![0];
    case "One Pair":
      if (eval1.pair !== eval2.pair) return eval1.pair! - eval2.pair!;
      for (let i = 0; i < 3; i++) {
        if (eval1.kickers![i] !== eval2.kickers![i])
          return eval1.kickers![i] - eval2.kickers![i];
      }
      return 0;
  }

  return 0; // Égalité parfaite
}

// Fonction pour calculer les cotes
export function calculateOdds(playerHands: Card[][], communityCards: Card[]) {
  const wins = new Array(playerHands.length).fill(0);
  const simulations = 50000;

  for (let i = 0; i < simulations; i++) {
    const deck = new Deck();
    deck.shuffle();

    // Retirer les cartes connues du deck
    for (const hand of playerHands) {
      deck.removeCards(hand);
    }
    deck.removeCards(communityCards);

    // Compléter les cartes communautaires
    const simulatedCommunityCards = [
      ...communityCards,
      ...deck.deal(5 - communityCards.length),
    ];

    // Évaluer chaque main
    const handStrengths = playerHands.map((hand) => [
      ...hand,
      ...simulatedCommunityCards,
    ]);

    // Déterminer le(s) gagnant(s)
    let winners: number[] = [];
    let bestHandStrength = -1;

    for (let j = 0; j < handStrengths.length; j++) {
      const currentHandStrength = evaluateHand(handStrengths[j]).strength;
      if (currentHandStrength > bestHandStrength) {
        winners = [j];
        bestHandStrength = currentHandStrength;
      } else if (currentHandStrength === bestHandStrength) {
        winners.push(j);
      }
    }

    // Répartir la victoire entre les gagnants
    const winValue = 1 / winners.length;
    winners.forEach((winner) => (wins[winner] += winValue));
  }

  // Calculer les pourcentages
  return wins.map((win) => (win / simulations) * 100);
}
