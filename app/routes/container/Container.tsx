import { useHeptabaseStore } from "~/store/heptabase";
import Navbar from "./Navbar";

export default function Container() {
  const { allCards } = useHeptabaseStore();
  return (
    <div className="flex h-full w-full flex-col md:mx-auto">
      {allCards.length > 0 ? (
        <>
          <Navbar />
          {/*<Content cards={allCards} />*/}
          {/*<ImageZoomOverlay />*/}
          {/*<CardHover />*/}
        </>
      ) : (
        <div />
      )}
    </div>
  );
}
