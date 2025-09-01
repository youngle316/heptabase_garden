import { Fragment, useEffect, useState } from "react";
import { SEO } from "site.config";
import { useCardIdNums, useCardIds, useHeptabaseStore, useIsMobile } from "~/store/heptabase";
import { generateCardIds } from "~/utils/heptabaseFunction";
import Card from "./Card/Card";
import ClosedCard from "./Card/ClosedCard";

export default function Content() {
  const { cardIdNums, setCardIdNums } = useCardIdNums();
  const [visibleCards, setVisibleCards] = useState<number>(0);
  const { setCardIds } = useCardIds();
  const { isMobile, setIsMobile } = useIsMobile();

  const { allCards: cards } = useHeptabaseStore();

  // biome-ignore lint: (biome lint/correctness/useExhaustiveDependencies)
  useEffect(() => {
    const cardIds = generateCardIds(cards);
    setCardIds(cardIds);
  }, [cards]);

  // biome-ignore lint: (biome lint/correctness/useExhaustiveDependencies)
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const cardIds = params.getAll("cardId");
      setCardIdNums(cardIds);

      if (cardIds.length === 0) {
        const aboutCardId = getCardIdByCardName("About");
        const searchParams = new URLSearchParams(window.location.search);

        searchParams.append("cardId", aboutCardId);
        searchParams.append("firstVisibleCardId", aboutCardId);
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

  // biome-ignore lint: (biome lint/correctness/useExhaustiveDependencies)
  useEffect(() => {
    const calculateVisibleCards = () => {
      const cardWidth = 448;
      const padding = 20;
      const windowWidth = window.innerWidth;
      const maxCards = Math.floor(windowWidth / (cardWidth + padding * 2));
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

  const getVisibleAndClosedCards = () => {
    if (cardIdNums.length === 0)
      return {
        visibleCardIds: [],
        beforeClosedCardIds: [],
        afterClosedCardIds: [],
      };

    const params = new URLSearchParams(window.location.search);
    const firstVisibleCardId = params.get("firstVisibleCardId");

    // biome-ignore lint: (biome lint/complexity/useIndexOf)
    const firstVisibleIndex = cardIdNums.findIndex((cardId) => cardId === firstVisibleCardId);

    let startIndex = firstVisibleIndex >= 0 ? firstVisibleIndex : 0;

    if (cardIdNums.length - firstVisibleIndex < visibleCards) {
      startIndex = Math.max(0, cardIdNums.length - visibleCards);
    }

    const endIndex = Math.min(startIndex + visibleCards, cardIdNums.length);

    const visibleCardIds = cardIdNums.slice(startIndex, endIndex);

    const beforeClosedCardIds = cardIdNums.slice(0, startIndex);
    const afterClosedCardIds = cardIdNums.slice(endIndex);

    return { visibleCardIds, beforeClosedCardIds, afterClosedCardIds };
  };

  return (
    <div className="flex">
      {cardIdNums.length > 0 ? (
        <div className="flex">
          {isMobile ? (
            <div>
              {cardIdNums.slice(-1).map((cardId) => {
                const content = getCardContentByCardId(cardId);
                if (!content) return null;
                return <Card cardId={cardId} key={cardId} content={content} />;
              })}
            </div>
          ) : (
            <>
              <div className="flex">
                {getVisibleAndClosedCards().beforeClosedCardIds.map((cardId) => (
                  <ClosedCard key={cardId} title={getCardTitleByCardId(cardId)} cardId={cardId} />
                ))}
              </div>

              {getVisibleAndClosedCards().visibleCardIds.map((cardId, index) => (
                <Fragment key={cardId}>
                  <Card cardId={cardId} content={getCardContentByCardId(cardId)} />
                  {index < cardIdNums.slice(-visibleCards).length - 1 && (
                    <div className="w-[1px] bg-foreground/10 dark:bg-foreground/10" />
                  )}
                </Fragment>
              ))}

              <div className="flex">
                {getVisibleAndClosedCards().afterClosedCardIds.map((cardId) => (
                  <ClosedCard key={cardId} title={getCardTitleByCardId(cardId)} cardId={cardId} />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <Card cardId={getCardIdByCardName("About")} content={getCardContentByName("About")} />
      )}
    </div>
  );
}
