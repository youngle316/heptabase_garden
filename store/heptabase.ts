import { create } from 'zustand';

const useHeptabaseStore = create<{
  allCards: Card[] | [];
  highlightData: HightlightElement[] | [];
  mentionInfos: MentionInfo[] | [];
  allMediaCards: MediaCard[] | [];
  setAllCards: (card: Card[]) => void;
  setHighlightData: (highlightData: HightlightElement[]) => void;
  setMentionInfos: (mentionInfos: MentionInfo[]) => void;
  setAllMediaCards: (allMediaCards: MediaCard[]) => void;
}>((set) => ({
  allCards: [],
  highlightData: [],
  mentionInfos: [],
  allMediaCards: [],
  setAllCards: (card) => set({ allCards: card }),
  setHighlightData: (highlightData) => set({ highlightData }),
  setMentionInfos: (mentionInfos) => set({ mentionInfos }),
  setAllMediaCards: (allMediaCards) => set({ allMediaCards }),
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

const useIsMobile = create<{
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
}>((set) => ({
  isMobile: false,
  setIsMobile: (isMobile) => set({ isMobile }),
}));

export { useCardIdNums, useCardIds, useHeptabaseStore, useIsMobile };
