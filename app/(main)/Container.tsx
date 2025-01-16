"use client";

import { useHeptabaseStore } from "@/store/heptabase";
import { useEffect } from "react";
import Content from "./Content";
import Navbar from "./Navbar";

export default function Container({
  initalData,
  highlightData,
  mentionInfos,
}: {
  initalData: Card[];
  highlightData: HightlightElement[];
  mentionInfos: MentionInfo[];
}) {
  const { allCards, setAllCards, setHighlightData, setMentionInfos } =
    useHeptabaseStore();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setAllCards(initalData);
    setHighlightData(highlightData);
    setMentionInfos(mentionInfos);
  }, [initalData, highlightData]);

  return (
    <div className="flex h-screen w-full flex-col md:mx-auto">
      {allCards.length > 0 ? (
        <>
          <Navbar />
          <div className="flex-1 overflow-hidden">
            <Content cards={allCards} />
          </div>
        </>
      ) : (
        <div />
      )}
    </div>
  );
}
