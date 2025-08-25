import { useHeptabaseStore } from "~/store/heptabase";
import type { TiptapDocument, TiptapNode } from "~/types";
import { generateCardHTML } from "~/utils/generateCardHTML";
import { transformBulletList, transformListItems } from "~/utils/heptabaseFunction";
import CardContent from "./CardContent";

export default function CardComponent({ cardId, content }: { cardId: string; content: string }) {
  const { highlightData, mentionInfos, allMediaCards, allCards: cards } = useHeptabaseStore();

  const parsedContent = JSON.parse(content) as TiptapDocument;
  const transformedContent = transformListItems(parsedContent.content).map((item: TiptapNode) => {
    return transformBulletList(item);
  });

  const genCardId = () => {
    return transformedContent.length > 0 ? transformedContent[0].attrs?.id : "";
  };

  const htmlContent = content
    ? generateCardHTML({
        content: parsedContent?.content,
        highlightData,
        cards,
        mentionInfos,
        allMediaCards,
      })
    : "";

  return (
    <div
      className="prose h-[calc(100vh-52px)] w-full shrink overflow-y-auto px-5 py-5 md:w-[488px]"
      data-card-id={genCardId()}
    >
      <CardContent cardId={cardId} htmlContent={htmlContent} />
    </div>
  );
}
