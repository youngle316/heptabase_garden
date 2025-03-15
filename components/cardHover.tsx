"use client";

import CardContent from "@/app/(main)/Card/CardContent";
import { useHeptabaseStore } from "@/store/heptabase";
import { generateCardHTML } from "@/utils/generateCardHTML";
import { useEffect, useRef, useState } from "react";

interface TooltipState {
  visible: boolean;
  position: { top: number; left: number };

  cardInfo: {
    cardId: string;
    cardContent: string;
    cards: [];
    element?: HTMLElement;
  } | null;
}

export default function CardHover() {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    position: { top: 0, left: 0 },
    cardInfo: null,
  });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { allCards, highlightData, mentionInfos } = useHeptabaseStore();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const calculatePosition = (rect: DOMRect, tooltipHeight = 384) => {
    const tooltipWidth = 448;
    const margin = 10;
    const scale = 0.85;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const scaledWidth = tooltipWidth * scale;
    const scaledHeight = tooltipHeight * scale;

    let left = rect.right + margin;
    let top = rect.top - 20;

    if (left + scaledWidth > windowWidth) {
      left = rect.left - tooltipWidth * scale - margin;
    }

    if (top + scaledHeight > windowHeight) {
      top = windowHeight - scaledHeight;
    }

    return { position: { top, left } };
  };

  useEffect(() => {
    if (!tooltip.visible || !tooltip.cardInfo || !tooltipRef.current) {
      return;
    }

    const updateTooltipPosition = () => {
      const cardElement = tooltip.cardInfo?.element;

      if (cardElement && tooltipRef.current) {
        const rect = cardElement.getBoundingClientRect();
        const tooltipHeight = tooltipRef.current.offsetHeight;
        const { position } = calculatePosition(rect, tooltipHeight);
        setTooltip((prev) => ({ ...prev, position }));
      } else {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    };

    updateTooltipPosition();

    const resizeObserver = new ResizeObserver(() => {
      updateTooltipPosition();
    });

    resizeObserver.observe(tooltipRef.current);

    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateTooltipPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scrollListener);
    };
  }, [tooltip.visible, tooltip.cardInfo]);

  useEffect(() => {
    if (isMobile) {
      return;
    }

    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const cardElement = target.closest('[data-type="card"]') as HTMLElement;

      if (cardElement) {
        const cardId = cardElement.getAttribute("data-card-id");
        const noreferrer = cardElement.getAttribute("noreferrer");
        if (noreferrer) {
          return;
        }
        const rect = cardElement.getBoundingClientRect();

        const card = allCards.find((card) => card.id === cardId);

        const htmlContent = card?.content
          ? generateCardHTML({
              content: JSON.parse(card?.content)?.content,
              highlightData,
              cards: allCards,
              mentionInfos,
            })
          : "";

        try {
          const { position } = calculatePosition(rect);

          setTooltip({
            visible: true,
            position,

            cardInfo: {
              cardId: cardId as string,
              cardContent: htmlContent,
              cards: allCards as [],
              element: cardElement,
            },
          });
        } catch (error) {
          console.error("Failed to parse card info:", error);
        }
      }
    };

    const handleMouseLeave = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const cardElement = target.closest('[data-type="card"]');

      if (!cardElement) {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    };

    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const cardElement = target.closest('[data-type="card"]');

      if (!cardElement) {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    };

    const handleGlobalMouseMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const cardElement = target.closest('[data-type="card"]');

      if (!cardElement) {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    };

    document.addEventListener("mouseover", handleMouseEnter);
    document.addEventListener("mouseout", handleMouseLeave);
    document.addEventListener("click", handleGlobalClick);
    document.addEventListener("mousemove", handleGlobalMouseMove);

    return () => {
      document.removeEventListener("mouseover", handleMouseEnter);
      document.removeEventListener("mouseout", handleMouseLeave);
      document.removeEventListener("click", handleGlobalClick);
      document.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [allCards, highlightData, mentionInfos, isMobile]);

  useEffect(() => {
    if (!tooltip.visible || !tooltip.cardInfo) {
      return;
    }

    const handleScroll = () => {
      const cardElement = tooltip.cardInfo?.element;
      if (cardElement) {
        const rect = cardElement.getBoundingClientRect();
        const { position } = calculatePosition(rect);
        setTooltip((prev) => ({ ...prev, position }));
      } else {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    };

    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, [tooltip.visible, tooltip.cardInfo]);

  if (isMobile || !tooltip.visible || !tooltip.cardInfo) {
    return null;
  }

  return (
    <div
      ref={tooltipRef}
      className="prose fixed z-50 max-h-[384px] w-[448px] overflow-y-hidden rounded-md border border-foreground/10 bg-background p-4 shadow-lg"
      style={{
        top: `${tooltip.position.top}px`,
        left: `${tooltip.position.left}px`,
        transform: "scale(0.85)",
        transformOrigin: "top left",
      }}
    >
      <CardContent
        cardId={tooltip.cardInfo.cardId}
        cards={tooltip.cardInfo.cards}
        htmlContent={tooltip.cardInfo.cardContent}
        showCardsExtraConntent={false}
      />
    </div>
  );
}
