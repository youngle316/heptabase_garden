import { addParentIdToContent } from "@/utils/heptabaseFunction";
import Content from "./(main)/Content";
import Navbar from "./(main)/Navbar";
export const revalidate = 60;

export async function generateStaticParams() {
  const data = await fetch(
    "https://api.dabing.one?whiteboard_id=641ea3e118cf2f1d33cda32e8580f77efa59094fc805b326c9fc8c6dd16489ee"
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

  return (
    <div className="flex h-screen w-full flex-col md:mx-auto">
      {data ? (
        <>
          <Navbar />
          <div className="flex-1 overflow-hidden">
            <Content cards={cardsWithParentId} />
          </div>
        </>
      ) : (
        <div>No data</div>
      )}
    </div>
  );
}
