"use client";
import { useHeptabaseStore } from "@/store/heptabase";
import { useEffect } from "react";

export default function CardContent({
  htmlContent,
  cards,
}: {
  htmlContent: string;
  cards: Card[];
}) {
  const { setAllCards } = useHeptabaseStore();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setAllCards(cards);
  }, [cards]);

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
  return (
    <div // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
