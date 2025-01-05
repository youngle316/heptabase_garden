'use client';

import { Node } from '@tiptap/core';

// 定义自定义 Card 节点
const CustomCard = Node.create({
  name: 'card',
  group: 'block',
  content: 'inline*',
  addOptions() {
    return {
      cards: [],
    };
  },
  addAttributes() {
    return {
      text: '',
      cardId: '',
      parentId: '',
    };
  },
  renderHTML({ HTMLAttributes, node }) {
    const cards = this.options.cards || [];
    const cardId = node.attrs.cardId;
    const card = cards.find((c: Card) => c.id === cardId);
    const parentId = node.attrs.parentId;

    return [
      'span',
      {
        ...HTMLAttributes,
        'data-type': 'card',
        'data-card-id': cardId,
        class: 'card',
        'data-parent-id': parentId,
        noreferrer: card ? undefined : 'true',
      },
      card ? card.title : node.attrs.text || cardId,
    ];
  },
});

export default CustomCard;
