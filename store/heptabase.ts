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

const useCardIds = create<{
  cardIds: { mainId: string; ids: string[] }[];
  setCardIds: (cardIds: { mainId: string; ids: string[] }[]) => void;
}>((set) => ({
  cardIds: [],
  setCardIds: (cardIds) => set({ cardIds }),
}));

export { useCardIdNums, useCardIds, useHeptabaseStore };
