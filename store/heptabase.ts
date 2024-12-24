import { create } from 'zustand';

const useHeptabaseStore = create<{
  allCards: Card[] | [];
  setAllCards: (card: Card[]) => void;
}>((set) => ({
  allCards: [],
  setAllCards: (card) => set({ allCards: card }),
}));

const useCardIdNums = create<{
  cardIdNums: string[] | [];
  setCardIdNums: (cardIdNums: string[]) => void;
  currentId: string;
  setCurrentId: (currentId: string) => void;
}>((set) => ({
  cardIdNums: [],
  setCardIdNums: (cardIdNums) => set({ cardIdNums }),
  currentId: '',
  setCurrentId: (currentId) => set({ currentId }),
}));

export { useCardIdNums, useHeptabaseStore };
