"use client";

import { useCardIdNums } from "@/store/heptabase";
import { useEffect } from "react";
import Card from "./Card/Card";

export default function Content({ cards }: { cards: Card[] }) {
  const { cardIdNums, setCardIdNums } = useCardIdNums();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cardIds = params.getAll("cardId");
    if (cardIds.length === 0) {
      const aboutCardId = getCardIdByCardName("About");
      const searchParams = new URLSearchParams(window.location.search);

      searchParams.append("cardId", aboutCardId);
      window.history.pushState({}, "", `?${searchParams.toString()}`);
      window.dispatchEvent(new Event("urlchange"));
    }
  }, []);

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const cardIds = params.getAll("cardId");
      setCardIdNums(cardIds);
    };

    window.addEventListener("urlchange", handleUrlChange);
    window.addEventListener("popstate", handleUrlChange);

    return () => {
      window.removeEventListener("urlchange", handleUrlChange);
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, [setCardIdNums]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cardIds = params.getAll("cardId");
    if (cardIds.length > 0) {
      setCardIdNums(cardIds);
    }
  }, [setCardIdNums]);

  const getCardContentByCardId = (cardId: string) => {
    return cards.find((card) => card.id === cardId)?.content || "";
  };

  const getCardContentByName = (cardName: string) => {
    return cards.find((card) => card.title === cardName)?.content || "";
  };

  const getCardIdByCardName = (cardName: string) => {
    return cards.find((card) => card.title === cardName)?.id || "";
  };

  return (
    <div className="mx-5 mt-5 flex justify-center gap-4 md:mx-auto">
      {cardIdNums.length > 0 ? (
        cardIdNums.map((cardId, index) => {
          const content = getCardContentByCardId(cardId);
          if (!content) return null;
          if (index !== cardIdNums.length - 1) {
            return (
              <>
                <div key={cardId} className="hidden md:flex">
                  <Card cards={cards} content={content} />
                </div>
                <div className="hidden h-screen w-[1px] bg-zinc-200 md:flex" />
              </>
            );
          }
          return <Card cards={cards} content={content} key={cardId} />;
        })
      ) : (
        // if no cardId, show the about card
        <Card cards={cards} content={getCardContentByName("About")} />
      )}
    </div>
  );
}
