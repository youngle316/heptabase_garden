"use client";
import { useCardIds, useHeptabaseStore } from "@/store/heptabase";
import dayjs from "dayjs";
import { useEffect } from "react";

export default function CardContent({
  cardId,
  htmlContent,
  cards,
}: {
  cardId: string;
  htmlContent: string;
  cards: Card[];
}) {
  const { allCards, setAllCards } = useHeptabaseStore();
  const { cardIds } = useCardIds();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setAllCards(cards);
  }, [cards]);

  const getCardInfo = (cardId: string) => {
    const card = cards.find((card) => card.id === cardId);
    return {
      createdTime: card?.createdTime || "",
      lastEditedTime: card?.lastEditedTime || "",
    };
  };

  useEffect(() => {
    const handleCardClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.getAttribute("data-type") === "card") {
        const cardId = target.getAttribute("data-card-id");
        const parentCardId = target.getAttribute("data-parent-id");
        if (cardId) {
          const searchParams = new URLSearchParams(window.location.search);
          const existingCardIds = searchParams.getAll("cardId");
          if (!existingCardIds.includes(cardId)) {
            if (parentCardId && existingCardIds.includes(parentCardId)) {
              const parentIndex = existingCardIds.indexOf(parentCardId);
              const keepCardIds = existingCardIds.slice(0, parentIndex + 1);
              searchParams.delete("cardId");
              for (const id of keepCardIds) {
                searchParams.append("cardId", id);
              }
            }
            searchParams.append("cardId", cardId);
            window.history.pushState({}, "", `?${searchParams.toString()}`);
            window.dispatchEvent(new Event("urlchange"));
          }
        }
      }
    };

    document.addEventListener("click", handleCardClick);
    return () => {
      document.removeEventListener("click", handleCardClick);
    };
  }, []);

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("YYYY-MM-DD");
  };

  const findLinkedCards = () => {
    return cardIds
      .filter((item) => item.ids.includes(cardId))
      .map((item) => item.mainId);
  };

  const handleCardClick = (cardId: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    const existingCardIds = searchParams.getAll("cardId");
    if (existingCardIds.includes(cardId)) {
      return;
    }
    searchParams.append("cardId", cardId);
    window.history.pushState({}, "", `?${searchParams.toString()}`);
    window.dispatchEvent(new Event("urlchange"));
  };

  return (
    <>
      <div // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      <div className="mt-8 text-muted-foreground text-xs">
        Last updated {formatDate(getCardInfo(cardId).lastEditedTime)}.
      </div>
      <div className="mt-8 rounded-md border border-foreground/10 p-4 pt-0 font-medium text-muted-foreground">
        <p>Links to this note:</p>
        <div>
          {findLinkedCards().length > 0 ? (
            findLinkedCards().map((item) => {
              const card = allCards.find((card) => card.id === item);
              return (
                <ul
                  className="text-[#207DFF] text-sm dark:text-[#61C6FA]"
                  key={item}
                >
                  <li onClick={() => handleCardClick(item)}>
                    <span className="cursor-pointer">{card?.title}</span>
                  </li>
                </ul>
              );
            })
          ) : (
            <div>📭</div>
          )}
        </div>
      </div>
    </>
  );
}
