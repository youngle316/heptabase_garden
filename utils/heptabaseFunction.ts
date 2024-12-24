// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function transformListItems(content: any) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return content.map((node: any) => {
    // 复制节点
    const newNode = { ...node };

    // 如果是列表项
    if (
      newNode.type === 'bullet_list_item' ||
      newNode.type === 'numbered_list_item'
    ) {
      // 处理内容数组中的第一层级节点
      if (newNode.content) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        newNode.content = newNode.content.map((child: any) => ({
          ...child,
          type: 'li',
        }));
      }
    }

    // 递归处理子内容
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
