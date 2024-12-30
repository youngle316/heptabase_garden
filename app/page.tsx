import { CONFIG } from "@/site.config";
import { addParentIdToContent } from "@/utils/heptabaseFunction";
import Container from "./(main)/Container";

export const revalidate = 3600;

export async function generateStaticParams() {
  const whiteboardId = CONFIG.whiteboardId;
  const data = await fetch(
    `https://api.dabing.one?whiteboard_id=${whiteboardId}`
  );
  const cardContent = await data.json();
  if (cardContent.code === 200 && cardContent.result === "success") {
    return cardContent;
  }
  return "";
}

export default async function Home() {
  const data = await generateStaticParams();

  if (!data) {
    return <div>There is no data. Please check your whiteboardId</div>;
  }

  const cardsWithParentId = addParentIdToContent(data?.data?.cards);

  return <Container initalData={cardsWithParentId} />;
}
