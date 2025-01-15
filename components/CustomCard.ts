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
      mentionInfos: [],
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

    const mentionInfos = this.options.mentionInfos || [];
    const mentionInfo = mentionInfos.find((m: MentionInfo) => m.id === cardId);

    return [
      'span',
      {
        ...HTMLAttributes,
        'data-type': 'card',
        'data-card-id': cardId,
        class: `card ${card ? '' : 'invalid-card'}`,
        'data-parent-id': parentId,
        noreferrer: card ? undefined : 'true',
      },
      [
        'span',
        {
          class:
            'border-b-solid border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.08)]',
        },
        card ? card.title : mentionInfo?.title || 'Invalid Card',
      ],
    ];
  },
});

export default CustomCard;
