// Interface pour les cartes
export interface ICard {
  id: string;
  value: string; // La valeur de la carte, par exemple 'A', '10', etc.
  suit: string; // La couleur de la carte, par exemple 'hearts', 'diamonds'
  src: string; // Le chemin de l'image de la carte, par exemple '/images/ace_of_hearts.png'
  zone: string; // Le nom de la zone d'origine de la carte, par exemple 'player1'
}
