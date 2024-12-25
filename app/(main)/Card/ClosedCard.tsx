import { X } from "lucide-react";

export default function ClosedCard({
  title,
  cardId,
  index,
}: {
  title: string;
  cardId: string;
  index: number;
}) {
  const handleShowCard = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const existingCardIds = searchParams.getAll("cardId");
    const cardIndex = existingCardIds.indexOf(cardId);

    if (cardIndex !== -1) {
      const keepCardIds = existingCardIds.slice(0, cardIndex + 1);
      searchParams.delete("cardId");
      for (const id of keepCardIds) {
        searchParams.append("cardId", id);
      }
      window.history.pushState({}, "", `?${searchParams.toString()}`);
      window.dispatchEvent(new Event("urlchange"));
    }
  };

  const handleCloseCard = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const searchParams = new URLSearchParams(window.location.search);
    const existingCardIds = searchParams.getAll("cardId");
    const cardIndex = existingCardIds.indexOf(cardId);

    if (cardIndex !== -1) {
      const keepCardIds = existingCardIds.slice(0, cardIndex);
      searchParams.delete("cardId");
      for (const id of keepCardIds) {
        searchParams.append("cardId", id);
      }
      window.history.pushState({}, "", `?${searchParams.toString()}`);
      window.dispatchEvent(new Event("urlchange"));
    }
  };

  return (
    <div
      onClick={handleShowCard}
      className="writing-vertical-rl flex flex-shrink-0 justify-between border-zinc-200 border-x px-2 py-4 text-xl"
    >
      <div className="flex-1 cursor-pointer hover:text-blue-400">{title}</div>
      {index !== 0 && (
        <div
          onClick={handleCloseCard}
          className="flex cursor-pointer items-center hover:text-zinc-500"
        >
          <X size={24} />
        </div>
      )}
    </div>
  );
}
