import { create } from "zustand";
import type { Card, HighlightElement, MediaCard, MentionInfo } from "~/types";

type HeptabaseStore = {
  allCards: Card[] | [];
  highlightData: HighlightElement[] | [];
  mentionInfos: MentionInfo["data"][] | [];
  allMediaCards: MediaCard[] | [];
  setAllCards: (card: Card[]) => void;
  setHighlightData: (highlightData: HighlightElement[]) => void;
  setMentionInfos: (mentionInfos: MentionInfo["data"][]) => void;
  setAllMediaCards: (allMediaCards: MediaCard[]) => void;
};

const useHeptabaseStore = create<HeptabaseStore>((set) => ({
  allCards: [],
  highlightData: [],
  mentionInfos: [],
  allMediaCards: [],
  setAllCards: (card) => set({ allCards: card }),
  setHighlightData: (highlightData) => set({ highlightData }),
  setMentionInfos: (mentionInfos) => set({ mentionInfos }),
  setAllMediaCards: (allMediaCards) => set({ allMediaCards }),
}));

type CardIdNums = {
  cardIdNums: string[] | [];
  setCardIdNums: (cardIdNums: string[]) => void;
  currentId: string;
  setCurrentId: (currentId: string) => void;
};

const useCardIdNums = create<CardIdNums>((set) => ({
  cardIdNums: [],
  setCardIdNums: (cardIdNums) => set({ cardIdNums }),
  currentId: "",
  setCurrentId: (currentId) => set({ currentId }),
}));

type CardIds = {
  cardIds: { mainId: string; ids: string[] }[];
  setCardIds: (cardIds: { mainId: string; ids: string[] }[]) => void;
};

const useCardIds = create<CardIds>((set) => ({
  cardIds: [],
  setCardIds: (cardIds) => set({ cardIds }),
}));

type IsMobile = {
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
};

const useIsMobile = create<IsMobile>((set) => ({
  isMobile: false,
  setIsMobile: (isMobile) => set({ isMobile }),
}));

export { useHeptabaseStore, useCardIdNums, useCardIds, useIsMobile };
