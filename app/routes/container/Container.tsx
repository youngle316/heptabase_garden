import useImageZoom from "~/components/ImageZoom";
import { useHeptabaseStore } from "~/store/heptabase";
import Content from "./Content";
import Navbar from "./Navbar";

export default function Container() {
  const { allCards } = useHeptabaseStore();
  const { ImageZoomOverlay } = useImageZoom();

  return (
    <div className="flex h-full w-full flex-col md:mx-auto">
      {allCards.length > 0 ? (
        <>
          <Navbar />
          <Content />
          <ImageZoomOverlay />
        </>
      ) : (
        <span>There are no cards available.</span>
      )}
    </div>
  );
}
