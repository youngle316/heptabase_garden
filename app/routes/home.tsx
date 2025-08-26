import { useEffect } from "react";
import { useLoaderData } from "react-router";
import { useHeptabaseStore } from "~/store/heptabase";
import { addParentIdToContent, mergeCardsAndJournals } from "~/utils/heptabaseFunction";
import { CONFIG, SEO } from "../../site.config";
import type { LoaderData } from "../types";
import Container from "./container/Container";

export function meta() {
  return [{ title: SEO.title }, { name: "description", content: SEO.description }];
}

export async function loader(): Promise<LoaderData> {
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
      },
    );

    if (!data.ok) {
      return { cardContent: null };
    }

    const cardContent = (await data.json()) as LoaderData["cardContent"];
    return { cardContent };
  } catch (error) {
    console.log(error);
    return { cardContent: null };
  }
}

export default function Home() {
  const { cardContent } = useLoaderData<LoaderData>();

  const { setAllCards, setHighlightData, setMentionInfos, setAllMediaCards } = useHeptabaseStore();

  // biome-ignore lint: (biome lint/correctness/useExhaustiveDependencies)
  useEffect(() => {
    if (!cardContent) return;
    const mergedData = mergeCardsAndJournals(cardContent.cards, cardContent.journals);
    const cardsWithParentId = addParentIdToContent(mergedData);

    const highlightData = cardContent.highlightElements;
    const mentionInfos = cardContent.mentionInfos.map((mentionInfo) => mentionInfo.data);
    const allMediaCards = cardContent.mediaCards;

    setAllCards(cardsWithParentId);
    setHighlightData(highlightData);
    setMentionInfos(mentionInfos);
    setAllMediaCards(allMediaCards);
  }, [cardContent]);

  if (!cardContent) {
    return <div>There is no data. Please check your whiteboardId</div>;
  }

  return (
    <main>
      <Container />
    </main>
  );
}
