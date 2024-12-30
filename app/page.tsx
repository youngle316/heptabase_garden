import { addParentIdToContent } from "@/utils/heptabaseFunction";
import Container from "./(main)/Container";

export const revalidate = 60;

export async function generateStaticParams() {
  const data = await fetch(
    `https://api.dabing.one?whiteboard_id=${process.env.WHITEBOARD_ID}`
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
