import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function useImageZoom() {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const handleImageClick = useCallback((e: MouseEvent) => {
    const imgElement = (e.target as HTMLElement).closest("img");
    if (imgElement?.classList.contains("cursor-zoom-in")) {
      setZoomedImage(imgElement.src);
    }
  }, []);

  const closeOverlay = useCallback(() => {
    setZoomedImage(null);
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleImageClick);

    return () => {
      document.removeEventListener("click", handleImageClick);
    };
  }, [handleImageClick]);

  const ImageZoomOverlay = () => {
    return createPortal(
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 z-[9999] flex h-full w-full cursor-zoom-out items-center justify-center bg-black bg-opacity-80"
            onClick={closeOverlay}
          >
            <motion.img
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              alt=""
              src={zoomedImage}
              className="max-h-[90%] max-w-[90%] cursor-zoom-out object-contain"
              onClick={closeOverlay}
            />
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );
  };

  return { ImageZoomOverlay, setZoomedImage };
}
