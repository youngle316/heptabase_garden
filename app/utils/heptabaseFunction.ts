import type { Card, Journal, TiptapDocument, TiptapNode } from "~/types";

type ParsedNode = [string, Record<string, string>, ...(ParsedNode | string)[]];

export function mergeCardsAndJournals(cards: Card[], journals: Journal[]) {
  const newJournals = journals.map((journal) => {
    return {
      ...journal,
      id: journal.date,
      title: journal.date,
      isJournal: true,
    };
  });
  return [...cards, ...newJournals] as Card[];
}

export function parseCardContent(content: string): TiptapDocument {
  try {
    return JSON.parse(content) as TiptapDocument;
  } catch {
    return {
      type: "doc",
      content: [],
    };
  }
}

export function addParentIdToContent(cards: Card[]) {
  return cards.map((card) => {
    const content = parseCardContent(card.content);

    const processNode = (node: TiptapNode) => {
      if (node.attrs) {
        node.attrs.parentId = card.id;
      }

      if (node.content) {
        node.content.forEach(processNode);
      }
    };

    content.content.forEach(processNode);

    return {
      ...card,
      content: JSON.stringify(content),
    } as Card;
  });
}

export function generateCardIds(cards: Card[]) {
  return cards.map((card) => {
    const content = JSON.parse(card.content);
    const cardIds: string[] = [];

    const findCardIds = (node: TiptapNode) => {
      if (node.type === "card" && node.attrs?.cardId) {
        cardIds.push(node.attrs.cardId);
      }

      if (node.type === "date" && node.attrs?.date) {
        cardIds.push(node.attrs.date);
      }

      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(findCardIds);
      }
    };

    if (content.content) {
      content.content.forEach(findCardIds);
    }

    return {
      mainId: card.id,
      ids: cardIds,
    };
  });
}

export function transformBulletList(content: TiptapNode) {
  if (content.type === "bullet_list_item" && Array.isArray(content.content)) {
    if (content.content.length > 1) {
      const [mainItem, ...childItems] = content.content;

      return {
        type: "bullet_list_item",
        attrs: content.attrs,
        content: [
          mainItem,
          {
            type: "bullet_list_item",
            attrs: {
              ...content.attrs,
              id: `${content?.attrs?.id}-children`,
            },
            content: childItems,
          },
        ],
      };
    }
  }
  return content;
}

export function transformListItems(content: TiptapNode[]) {
  const mergedContent = mergeNumberedListItems(content);

  return mergedContent.map((node: TiptapNode) => {
    const newNode = { ...node };

    if (newNode.type === "bullet_list_item" || newNode.type === "numbered_list_item") {
      if (newNode.content) {
        newNode.content = newNode.content.map((child: TiptapNode) => ({
          ...child,
          type: "li",
        }));
      }
    }

    if (newNode.content) {
      newNode.content = transformListItems(newNode.content);
    }

    return newNode;
  });
}

function mergeNumberedListItems(items: TiptapNode[]): TiptapNode[] {
  const result: TiptapNode[] = [];
  let currentNumberedList: TiptapNode[] = [];

  items.forEach((item, index) => {
    if (item.type === "numbered_list_item") {
      currentNumberedList.push(item);

      if (index === items.length - 1 || items[index + 1]?.type !== "numbered_list_item") {
        if (currentNumberedList.length > 0) {
          result.push({
            type: "numbered_list_item",
            attrs: currentNumberedList[0].attrs,
            content: currentNumberedList.flatMap((item) => item.content || []),
          });
          currentNumberedList = [];
        }
      }
    } else {
      result.push(item);
    }
  });

  return result;
}

export const parseNode = (node: Element): ParsedNode => {
  const tagName = node.tagName.toLowerCase();
  const attrs: Record<string, string> = {};

  for (const attr of node.attributes) {
    attrs[attr.name] = attr.value;
  }

  const children = Array.from(node.childNodes)
    .map((child) => {
      if (child.nodeType === 1) {
        return parseNode(child as Element);
      }

      if (child.nodeType === 3) {
        const text = child.textContent;
        return text ? text : "";
      }

      return "";
    })
    .filter(Boolean);

  return [tagName, attrs, ...children];
};
