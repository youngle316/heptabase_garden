import dayjs from "dayjs";
import hljs from "highlight.js";
import katex from "katex";
import { useEffect, useState } from "react";
import { useCardIds, useHeptabaseStore } from "~/store/heptabase";
// import ShareContent from "./ShareContent";

export default function CardContent({
  cardId,
  htmlContent,
  showCardsExtraConntent = true,
}: {
  cardId: string;
  htmlContent: string;
  showCardsExtraConntent?: boolean;
}) {
  const { allCards, setAllCards } = useHeptabaseStore();
  const { cardIds } = useCardIds();

  const [journalInfo, setJournalInfo] = useState({ title: "", day: "" });

  useEffect(() => {
    const cardInfo = allCards.find((card) => card.id === cardId);
    if (cardInfo?.isJournal) {
      const day = dayjs(cardInfo.title).format("dddd");
      setJournalInfo({ title: cardInfo.title, day });
    }
  }, [allCards, cardId]);

  useEffect(() => {
    hljs.highlightAll();

    const renderMathFormulas = () => {
      const mathInlineElements = document.querySelectorAll(".math-inline[data-formula]");
      const mathDisplayElements = document.querySelectorAll(".math-display[data-formula]");

      mathInlineElements.forEach((element) => {
        const formula = element.getAttribute("data-formula");
        if (formula && !element.querySelector(".katex")) {
          try {
            katex.render(formula, element as HTMLElement, {
              displayMode: false,
              throwOnError: false,
              output: "html",
              strict: false,
            });
          } catch (error) {
            console.warn("KaTeX inline rendering failed:", error);
            element.textContent = `$${formula}$`;
          }
        }
      });

      mathDisplayElements.forEach((element) => {
        const formula = element.getAttribute("data-formula");
        if (formula && !element.querySelector(".katex")) {
          try {
            katex.render(formula, element as HTMLElement, {
              displayMode: true,
              throwOnError: false,
              output: "html",
              strict: false,
            });
          } catch (error) {
            console.warn("KaTeX display rendering failed:", error);
            element.textContent = `$$${formula}$$`;
          }
        }
      });
    };

    const observer = new MutationObserver(() => {
      hljs.highlightAll();
      renderMathFormulas();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    renderMathFormulas();

    return () => observer.disconnect();
  }, []);

  const getCardInfo = (cardId: string) => {
    const card = allCards.find((card) => card.id === cardId);
    return {
      createdTime: card?.createdTime || "",
      lastEditedTime: card?.lastEditedTime || "",
    };
  };

  // useEffect(() => {
  //   const observer = new MutationObserver(() => {
  //     const mathElements = document.querySelectorAll(".math-content");
  //     for (const element of mathElements) {
  //       const content = element.getAttribute("data-math");
  //       if (content && !element.querySelector("svg")) {
  //         const html = MM.render(
  //           element.classList.contains("math-block") ? `$$${content}$$` : `$${content}$`,
  //         );
  //         element.innerHTML = html;
  //       }
  //     }
  //   });

  //   observer.observe(document.body, {
  //     childList: true,
  //     subtree: true,
  //   });

  //   const mathElements = document.querySelectorAll(".math-content");
  //   for (const element of mathElements) {
  //     const content = element.getAttribute("data-math");
  //     if (content) {
  //       const html = MM.render(
  //         element.classList.contains("math-block") ? `$$${content}$$` : `$${content}$`,
  //       );
  //       element.innerHTML = html;
  //     }
  //   }

  //   return () => observer.disconnect();
  // }, []);

  const handleCardClick = (target: HTMLElement) => {
    const cardId = target.getAttribute("data-card-id");
    const parentCardId = target.getAttribute("data-parent-id");
    const noreferrer = target.getAttribute("noreferrer");
    if (noreferrer) {
      return;
    }
    if (cardId) {
      const searchParams = new URLSearchParams(window.location.search);
      const existingCardIds = searchParams.getAll("cardId");
      if (!existingCardIds.includes(cardId)) {
        if (parentCardId && existingCardIds.includes(parentCardId)) {
          const parentIndex = existingCardIds.indexOf(parentCardId);
          const keepCardIds = existingCardIds.slice(0, parentIndex + 1);
          searchParams.delete("cardId");
          for (const id of keepCardIds) {
            searchParams.append("cardId", id);
          }
        }
        searchParams.append("cardId", cardId);

        searchParams.delete("firstVisibleCardId");
        searchParams.append("firstVisibleCardId", cardId);

        window.history.pushState({}, "", `?${searchParams.toString()}`);
        window.dispatchEvent(new Event("urlchange"));
      }
    }
  };

  // biome-ignore lint: lint/suspicious/noExplicitAny
  const updateFolded = (items: any[], nodeId: string): boolean => {
    if (!Array.isArray(items)) return false;

    for (const item of items) {
      if (item.type === "toggle_list_item" && item.attrs?.id === nodeId) {
        item.attrs.folded = !item.attrs.folded;
        return true;
      }

      if (item.content && Array.isArray(item.content)) {
        if (updateFolded(item.content, nodeId)) {
          return true;
        }
      }
    }
    return false;
  };

  const handleToggleListClick = (target: HTMLElement) => {
    const nodeId = target.getAttribute("data-node-id") as string;
    const cardContent = JSON.parse(allCards.find((card) => card.id === cardId)?.content || "[]");

    updateFolded(cardContent.content, nodeId);
    const tempCard = [...allCards];
    for (const card of tempCard) {
      if (card.id === cardId) {
        card.content = JSON.stringify(cardContent);
      }
    }
    setAllCards(tempCard);
  };

  // biome-ignore lint: lint/correctness/useExhaustiveDependencies
  useEffect(() => {
    const handleDomClick = (event: MouseEvent) => {
      event.stopPropagation();
      const target = event.target as HTMLElement;

      const cardElement = target.closest('[data-type="card"]');
      if (cardElement) {
        handleCardClick(cardElement as HTMLElement);
      }

      const toggleElement = target.closest('[data-type="toggle_list_item_icon"]');
      if (toggleElement) {
        handleToggleListClick(toggleElement as HTMLElement);
      }
    };

    document.addEventListener("click", handleDomClick);
    return () => {
      document.removeEventListener("click", handleDomClick);
    };
  }, []);

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("YYYY-MM-DD");
  };

  const findLinkedCards = () => {
    return cardIds.filter((item) => item.ids.includes(cardId)).map((item) => item.mainId);
  };

  const handleLinksCardClick = (cardId: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    const existingCardIds = searchParams.getAll("cardId");
    if (existingCardIds.includes(cardId)) {
      return;
    }
    searchParams.append("cardId", cardId);
    window.history.pushState({}, "", `?${searchParams.toString()}`);
    window.dispatchEvent(new Event("urlchange"));
  };

  useEffect(() => {
    const processLinks = async () => {
      const links = document.querySelectorAll("p > a");
      for (const link of links) {
        const href = link.getAttribute("href");
        if (!href) continue;

        const parentP = link.closest("p");
        if (!parentP) continue;

        if (href.includes("open.spotify.com/track/")) {
          const trackId = href.match(/track\/([^?]+)/)?.[1];
          if (trackId) {
            const spotifyEmbed = document.createElement("div");
            spotifyEmbed.className = "my-1";
            spotifyEmbed.innerHTML = `
              <iframe
                style="border-radius:12px"
                src="https://open.spotify.com/embed/track/${trackId}?utm_source=generator"
                width="100%"
                height="152"
                frameBorder="0"
                allowfullscreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy">
              </iframe>
            `;
            parentP.insertAdjacentElement("afterend", spotifyEmbed);
          }
        }

        // if (href.includes("douban.com")) {
        //   try {
        //     const response = await fetch(
        //       `/api/douban?url=${encodeURIComponent(href)}`
        //     );
        //     const data = await response.json();

        //     const doubanInfo = document.createElement("div");
        //     doubanInfo.className =
        //       "douban-info flex items-center gap-3 p-4 my-2 bg-douban rounded-lg border-douban";
        //     doubanInfo.innerHTML = `
        //       <div class="flex flex-col gap-[6px]">
        //       <div class="text-muted-foreground text-xs">豆瓣</div>
        //         <p>
        //         <a href="${data.url}" target="_blank">${data.title}</a>
        //         </p>
        //         <div class="text-sm text-muted-foreground">${
        //           data.description
        //         }</div>
        //       </div>
        //       <div class="flex-shrink-0">
        //         ${
        //           data.image
        //             ? `<img src="/api/proxy-image?url=${encodeURIComponent(
        //                 data.image
        //               )}" alt="${data.title}" class="w-16 rounded" />`
        //             : ""
        //         }
        //       </div>
        //     `;
        //     parentP.insertAdjacentElement("afterend", doubanInfo);
        //   } catch (error) {
        //     console.error("Error fetching douban data:", error);
        //   }
        // }
      }
    };

    processLinks();
  }, []);

  return (
    <>
      {journalInfo.title && (
        <div className="py-12">
          <div className="rounded-xl px-0.5">
            <div className="mb-3 text-danger text-label">{journalInfo.day}</div>
            <div className="font-semibold text-4xl text-primary">
              {dayjs(journalInfo.title).format("MMM D, YYYY")}
            </div>
          </div>
        </div>
      )}

      <div // biome-ignore lint: lint/security/noDangerouslySetInnerHtml
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {showCardsExtraConntent && (
        <>
          <div className="group mt-8 flex items-center justify-between text-muted-foreground text-xs">
            <div>Last updated {formatDate(getCardInfo(cardId).lastEditedTime)}.</div>
            {/*<div>{cardId && <ShareContent cardId={cardId} />}</div>*/}
          </div>
          <div className="mt-8 rounded-md border border-foreground/10 p-4 pt-0 font-medium text-muted-foreground">
            <p>Links to this note:</p>
            <div>
              {findLinkedCards().length > 0 ? (
                findLinkedCards().map((item) => {
                  const card = allCards.find((card) => card.id === item);
                  return (
                    <ul className="text-[#207DFF] text-sm dark:text-[#61C6FA]" key={item}>
                      <li onClick={() => handleLinksCardClick(item)} onKeyDown={() => {}}>
                        <span data-type="card" data-card-id={card?.id} className="cursor-pointer">
                          {card?.title || card?.id}
                        </span>
                      </li>
                    </ul>
                  );
                })
              ) : (
                <div>📭</div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
