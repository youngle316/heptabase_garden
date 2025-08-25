import type { Card, Journal, TiptapDocument, TiptapNode } from "~/types";

export function mergeCardsAndJournals(cards: Card[], journals: Journal[]) {
  const newJournals = journals.map((journal) => {
    return {
      ...journal,
      id: journal.date,
      title: journal.date,
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
