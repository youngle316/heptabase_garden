"use client";

import { SEO } from "@/site.config";
import { useCardIdNums, useCardIds } from "@/store/heptabase";
import { generateCardIds } from "@/utils/heptabaseFunction";
import type { Metadata } from "next/types";
import { Fragment, useEffect, useState } from "react";
import Card from "./Card/Card";
import ClosedCard from "./Card/ClosedCard";

export const metadata: Metadata = {
  title: "数字花园🌿",
  description: "use heptabase to build your digital garden",
};

export default function Content({ cards }: { cards: Card[] }) {
  const { cardIdNums, setCardIdNums } = useCardIdNums();
  const [visibleCards, setVisibleCards] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { setCardIds } = useCardIds();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const cardIds = generateCardIds(cards);
    setCardIds(cardIds);
  }, []);

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const cardIds = params.getAll("cardId");
      setCardIdNums(cardIds);

      if (cardIds.length === 0) {
        const aboutCardId = getCardIdByCardName("About");
        const searchParams = new URLSearchParams(window.location.search);

        searchParams.append("cardId", aboutCardId);
        window.history.pushState({}, "", `?${searchParams.toString()}`);
        window.dispatchEvent(new Event("urlchange"));
      }

      const lastCardId = cardIds[cardIds.length - 1];
      if (lastCardId) {
        const cardTitle = getCardTitleByCardId(lastCardId);
        document.title = cardTitle ? `${cardTitle} | ${SEO.title}` : SEO.title;
      } else {
        document.title = SEO.title;
      }
    };

    handleUrlChange();

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

  useEffect(() => {
    const calculateVisibleCards = () => {
      const cardWidth = 580;
      const padding = 16;
      const gap = 16;
      const windowWidth = window.innerWidth;
      const maxCards = Math.floor(
        (windowWidth - padding * 2) / (cardWidth + gap)
      );
      setVisibleCards(maxCards);
    };

    const calculateIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    calculateVisibleCards();
    calculateIsMobile();
    window.addEventListener("resize", calculateVisibleCards);
    window.addEventListener("orientationchange", calculateIsMobile);
    return () => {
      window.removeEventListener("resize", calculateVisibleCards);
      window.removeEventListener("orientationchange", calculateIsMobile);
    };
  }, [cardIdNums.length]);

  const getCardContentByCardId = (cardId: string) => {
    return cards.find((card) => card.id === cardId)?.content || "";
  };

  const getCardContentByName = (cardName: string) => {
    return cards.find((card) => card.title === cardName)?.content || "";
  };

  const getCardIdByCardName = (cardName: string) => {
    return cards.find((card) => card.title === cardName)?.id || "";
  };

  const getCardTitleByCardId = (cardId: string) => {
    return cards.find((card) => card.id === cardId)?.title || "";
  };

  return (
    <div className="flex gap-6">
      {cardIdNums.length > 0 ? (
        <>
          {isMobile ? (
            <>
              {cardIdNums.slice(-1).map((cardId) => {
                const content = getCardContentByCardId(cardId);
                if (!content) return null;
                return (
                  <Card
                    cardId={cardId}
                    key={cardId}
                    cards={cards}
                    content={content}
                  />
                );
              })}
            </>
          ) : (
            <>
              <div className="flex">
                {cardIdNums.slice(0, -visibleCards).map((cardId, index) => (
                  <ClosedCard
                    key={cardId}
                    title={getCardTitleByCardId(cardId)}
                    cardId={cardId}
                    index={index}
                  />
                ))}
              </div>

              {cardIdNums.slice(-visibleCards).map((cardId, index) => (
                <Fragment key={cardId}>
                  <Card
                    cards={cards}
                    cardId={cardId}
                    content={getCardContentByCardId(cardId)}
                  />
                  {index < cardIdNums.slice(-visibleCards).length - 1 && (
                    <div className="w-[1px] bg-foreground/10 dark:bg-foreground/10" />
                  )}
                </Fragment>
              ))}
            </>
          )}
        </>
      ) : (
        <Card
          cardId={getCardIdByCardName("About")}
          cards={cards}
          content={getCardContentByName("About")}
        />
      )}
    </div>
  );
}
