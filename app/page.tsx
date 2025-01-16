import { CONFIG } from "@/site.config";
import {
  addParentIdToContent,
  mergeCardsAndJournals,
} from "@/utils/heptabaseFunction";
import Container from "./(main)/Container";

export const revalidate = 3600;

export async function generateStaticParams() {
  const whiteboardId = CONFIG.whiteboardId;

  try {
    const data = await fetch(
      `https://api.heptabase.com/v1/whiteboard-sharing/?secret=${whiteboardId}`,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          "Accept-Language": "en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7,zh-CN;q=0.6",
        },
      }
    );

    if (!data.ok) {
      return "";
    }

    const cardContent = await data.json();
    return cardContent;
  } catch (error) {
    return "";
  }
}

export default async function Home() {
  const data = await generateStaticParams();

  if (!data) {
    return <div>There is no data. Please check your whiteboardId</div>;
  }

  const mergedData = mergeCardsAndJournals(data?.cards, data?.journals);

  const cardsWithParentId = addParentIdToContent(mergedData);

  return (
    <Container
      initalData={cardsWithParentId}
      highlightData={data?.highlightElements}
      mentionInfos={
        data?.mentionInfos
          ? data?.mentionInfos.map(
              (item: { data: { title: string; id: string }; type: string }) =>
                item.data
            )
          : []
      }
    />
  );
}
