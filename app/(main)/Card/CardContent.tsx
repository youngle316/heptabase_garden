"use client";

import { useCardIds, useHeptabaseStore } from "@/store/heptabase";
import dayjs from "dayjs";
import hljs from "highlight.js";
import { MathpixMarkdownModel as MM } from "mathpix-markdown-it";
import { useEffect, useState } from "react";

export default function CardContent({
  cardId,
  htmlContent,
  cards,
}: {
  cardId: string;
  htmlContent: string;
  cards: Card[];
}) {
  const { allCards, setAllCards } = useHeptabaseStore();
  const { cardIds } = useCardIds();

  const [journalInfo, setJournalInfo] = useState({ title: "", day: "" });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const cardInfo = cards.find((card) => card.id === cardId);
    if (cardInfo?.date) {
      const day = dayjs(cardInfo.date).format("dddd");
      setJournalInfo({ title: cardInfo.title, day });
    }
  }, []);

  // 初始执行
  useEffect(() => {
    // 初始执行
    hljs.highlightAll();

    // 创建观察器来监听DOM变化
    const observer = new MutationObserver(() => {
      hljs.highlightAll();
    });

    // 开始观察
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 清理函数
    return () => observer.disconnect();
  }, []);

  const getCardInfo = (cardId: string) => {
    const card = cards.find((card) => card.id === cardId);
    return {
      createdTime: card?.createdTime || "",
      lastEditedTime: card?.lastEditedTime || "",
    };
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const mathElements = document.querySelectorAll(".math-content");
      for (const element of mathElements) {
        const content = element.getAttribute("data-math");
        if (content && !element.querySelector("svg")) {
          const html = MM.render(
            element.classList.contains("math-block")
              ? `$$${content}$$`
              : `$${content}$`
          );
          element.innerHTML = html;
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const mathElements = document.querySelectorAll(".math-content");
    for (const element of mathElements) {
      const content = element.getAttribute("data-math");
      if (content) {
        const html = MM.render(
          element.classList.contains("math-block")
            ? `$$${content}$$`
            : `$${content}$`
        );
        element.innerHTML = html;
      }
    }

    return () => observer.disconnect();
  }, []);

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
        window.history.pushState({}, "", `?${searchParams.toString()}`);
        window.dispatchEvent(new Event("urlchange"));
      }
    }
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const updateFolded = (items: any[], nodeId: string): boolean => {
    if (!Array.isArray(items)) return false;

    for (const item of items) {
      // 检查当前项是否为 toggle_list_item 且 id 匹配
      if (item.type === "toggle_list_item" && item.attrs?.id === nodeId) {
        item.attrs.folded = !item.attrs.folded;
        return true; // 找到并修改后立即返回
      }

      // 递归检查 content 数组
      if (item.content && Array.isArray(item.content)) {
        if (updateFolded(item.content, nodeId)) {
          return true; // 如果在子内容中找到并修改，也立即返回
        }
      }
    }
    return false;
  };

  const handleToggleListClick = (target: HTMLElement) => {
    const nodeId = target.getAttribute("data-node-id") as string;
    const cardContent = JSON.parse(
      cards.find((card) => card.id === cardId)?.content || "[]"
    );

    updateFolded(cardContent.content, nodeId);
    const tempCard = [...cards];
    for (const card of tempCard) {
      if (card.id === cardId) {
        card.content = JSON.stringify(cardContent);
      }
    }
    setAllCards(tempCard);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const handleDomClick = (event: MouseEvent) => {
      event.stopPropagation();
      const target = event.target as HTMLElement;

      // 查找最近的带有 data-type="card" 的父元素
      const cardElement = target.closest('[data-type="card"]');
      if (cardElement) {
        handleCardClick(cardElement as HTMLElement);
      }

      // 查找最近的带有 data-type="toggle_list_item_icon" 的父元素
      const toggleElement = target.closest(
        '[data-type="toggle_list_item_icon"]'
      );
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
    return cardIds
      .filter((item) => item.ids.includes(cardId))
      .map((item) => item.mainId);
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
            continue;
          }
        }

        if (href.includes("douban.com")) {
          try {
            const response = await fetch(
              `/api/douban?url=${encodeURIComponent(href)}`
            );
            const data = await response.json();

            const doubanInfo = document.createElement("div");
            doubanInfo.className =
              "douban-info flex items-center gap-3 p-4 my-2 bg-douban rounded-lg border-douban";
            doubanInfo.innerHTML = `
              <div class="flex flex-col gap-[6px]">
              <div class="text-muted-foreground text-xs">豆瓣</div>
                <p>
                <a href="${data.url}" target="_blank">${data.title}</a>
                </p>
                <div class="text-sm text-muted-foreground">${
                  data.description
                }</div>
              </div>
              <div class="flex-shrink-0">
                ${
                  data.image
                    ? `<img src="/api/proxy-image?url=${encodeURIComponent(
                        data.image
                      )}" alt="${data.title}" class="w-16 rounded" />`
                    : ""
                }
              </div>
            `;
            parentP.insertAdjacentElement("afterend", doubanInfo);
          } catch (error) {
            console.error("Error fetching douban data:", error);
          }
        }
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

      <div // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      <div className="mt-8 text-muted-foreground text-xs">
        Last updated {formatDate(getCardInfo(cardId).lastEditedTime)}.
      </div>
      <div className="mt-8 rounded-md border border-foreground/10 p-4 pt-0 font-medium text-muted-foreground">
        <p>Links to this note:</p>
        <div>
          {findLinkedCards().length > 0 ? (
            findLinkedCards().map((item) => {
              const card = allCards.find((card) => card.id === item);
              return (
                <ul
                  className="text-[#207DFF] text-sm dark:text-[#61C6FA]"
                  key={item}
                >
                  <li onClick={() => handleLinksCardClick(item)}>
                    <span className="cursor-pointer">{card?.title}</span>
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
  );
}
