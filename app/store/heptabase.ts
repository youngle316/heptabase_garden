import { create } from "zustand";
import type { Card, HighlightElement, MediaCard, MentionInfo } from "~/types";

const useHeptabaseStore = create<{
  allCards: Card[] | [];
  highlightData: HighlightElement[] | [];
  mentionInfos: MentionInfo["data"][] | [];
  allMediaCards: MediaCard[] | [];
  setAllCards: (card: Card[]) => void;
  setHighlightData: (highlightData: HighlightElement[]) => void;
  setMentionInfos: (mentionInfos: MentionInfo["data"][]) => void;
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

export { useHeptabaseStore };
