"use client";

import { useHeptabaseStore } from "@/store/heptabase";
import { useEffect } from "react";
import Content from "./Content";
import Navbar from "./Navbar";

export default function Container({ initalData }: { initalData: Card[] }) {
  const { allCards, setAllCards } = useHeptabaseStore();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setAllCards(initalData);
  }, [initalData]);

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
