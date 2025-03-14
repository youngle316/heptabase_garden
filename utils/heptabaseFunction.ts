// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function transformListItems(content: any) {
  const mergedContent = mergeNumberedListItems(content);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return mergedContent.map((node: any) => {
    const newNode = { ...node };

    if (
      newNode.type === 'bullet_list_item' ||
      newNode.type === 'numbered_list_item'
    ) {
      if (newNode.content) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        newNode.content = newNode.content.map((child: any) => ({
          ...child,
          type: 'li',
        }));
      }
    }

    if (newNode.content) {
      newNode.content = transformListItems(newNode.content);
    }

    return newNode;
  });
}

export function generateCardIds(cards: Card[]) {
  return cards.map((card) => {
    const content = JSON.parse(card.content);
    const cardIds: string[] = [];

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const findCardIds = (node: any) => {
      if (node.type === 'card' && node.attrs?.cardId) {
        cardIds.push(node.attrs.cardId);
      }

      if (node.type === 'date' && node.attrs?.date) {
        cardIds.push(node.attrs.date);
      }

      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(findCardIds);
      }
    };

    // 从根节点开始递归查找
    if (content.content) {
      content.content.forEach(findCardIds);
    }

    return {
      mainId: card.id,
      ids: cardIds,
    };
  });
}

export function addParentIdToContent(cards: Card[]) {
  return cards.map((card) => {
    const content = JSON.parse(card.content);

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const processNode = (node: any) => {
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
    };
  });
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function transformBulletList(content: any) {
  if (content.type === 'bullet_list_item' && Array.isArray(content.content)) {
    if (content.content.length > 1) {
      const [mainItem, ...childItems] = content.content;

      return {
        type: 'bullet_list_item',
        attrs: content.attrs,
        content: [
          mainItem,
          {
            type: 'bullet_list_item',
            attrs: {
              ...content.attrs,
              id: `${content.attrs.id}-children`,
            },
            content: childItems,
          },
        ],
      };
    }
  }
  return content;
}

function mergeNumberedListItems(items: Content[]): Content[] {
  const result: Content[] = [];
  let currentNumberedList: Content[] = [];

  items.forEach((item, index) => {
    if (item.type === 'numbered_list_item') {
      currentNumberedList.push(item);

      if (
        index === items.length - 1 ||
        items[index + 1]?.type !== 'numbered_list_item'
      ) {
        if (currentNumberedList.length > 0) {
          result.push({
            type: 'numbered_list_item',
            attrs: currentNumberedList[0].attrs,
            content: currentNumberedList.flatMap((item) => item.content),
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

export function mergeCardsAndJournals(cards: Card[], journals: Card[]) {
  const newJournals = journals.map((journal) => {
    return {
      ...journal,
      id: journal.date,
      title: journal.date,
    };
  });
  return [...cards, ...newJournals];
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const parseNode = (node: Element): any[] => {
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
        return text ? text : '';
      }

      return '';
    })
    .filter(Boolean);

  return [tagName, attrs, ...children];
};
