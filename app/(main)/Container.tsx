"use client";

import useImageZoom from "@/components/ImageZoom";
import CardHover from "@/components/cardHover";
import { useHeptabaseStore } from "@/store/heptabase";
import { useEffect } from "react";
import Content from "./Content";
import Navbar from "./Navbar";
export default function Container({
  initalData,
  highlightData,
  mentionInfos,
  allMediaCards,
}: {
  initalData: Card[];
  highlightData: HightlightElement[];
  mentionInfos: MentionInfo[];
  allMediaCards: MediaCard[];
}) {
  const { ImageZoomOverlay } = useImageZoom();

  const {
    allCards,
    setAllCards,
    setHighlightData,
    setMentionInfos,
    setAllMediaCards,
  } = useHeptabaseStore();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setAllCards(initalData);
    setHighlightData(highlightData);
    setMentionInfos(mentionInfos);
    setAllMediaCards(allMediaCards);
  }, [initalData, highlightData, mentionInfos, allMediaCards]);

  return (
    <div className="flex h-screen w-full flex-col md:mx-auto">
      {allCards.length > 0 ? (
        <>
          <Navbar />
          <div className="flex-1 overflow-hidden">
            <Content cards={allCards} />
          </div>
          <ImageZoomOverlay />
          <CardHover />
        </>
      ) : (
        <div />
      )}
    </div>
  );
}
