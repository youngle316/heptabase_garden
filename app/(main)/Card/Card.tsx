import { useHeptabaseStore } from "@/store/heptabase";
import { generateCardHTML } from "@/utils/generateCardHTML";
import {
  transformBulletList,
  transformListItems,
} from "@/utils/heptabaseFunction";
import CardContent from "./CardContent";

export default function CardComponent({
  cardId,
  content,
  cards,
}: {
  cardId: string;
  content: string;
  cards: Card[];
}) {
  const { highlightData, mentionInfos } = useHeptabaseStore();

  const parsedContent = JSON.parse(content);
  const transformedContent = transformListItems(parsedContent.content).map(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (item: any) => transformBulletList(item)
  );

  const genCardId = () => {
    return transformedContent.length > 0 ? transformedContent[0].attrs.id : "";
  };

  const htmlContent = content
    ? generateCardHTML({
        content: parsedContent?.content,
        highlightData,
        cards,
        mentionInfos,
      })
    : "";

  return (
    <div
      className="prose h-screen w-full shrink overflow-y-auto px-5 pt-4 pb-16 md:w-[488px]"
      data-card-id={genCardId()}
    >
      <CardContent cardId={cardId} cards={cards} htmlContent={htmlContent} />
    </div>
  );
}
