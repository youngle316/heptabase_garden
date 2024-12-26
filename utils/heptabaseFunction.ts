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
