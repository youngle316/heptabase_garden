import { CONFIG } from "@/site.config";
import { addParentIdToContent } from "@/utils/heptabaseFunction";
import Container from "./(main)/Container";
export const revalidate = CONFIG.revalidate;

export async function generateStaticParams() {
  const data = await fetch(
    `https://api.dabing.one?whiteboard_id=${CONFIG.whiteboardId}`
  );
  const cardContent = await data.json();
  if (cardContent.code === 200 && cardContent.result === "success") {
    return cardContent;
  }
  return "";
}

export default async function Home() {
  const data = await generateStaticParams();
  const cardsWithParentId = addParentIdToContent(data?.data?.cards);

  return <Container initalData={cardsWithParentId} />;
}
