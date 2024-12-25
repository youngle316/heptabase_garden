import { Node, mergeAttributes } from '@tiptap/core';

export const MathInline = Node.create({
  name: 'math_inline',
  group: 'inline',
  inline: true,
  content: 'text*',

  parseHTML() {
    return [
      {
        tag: 'span[data-type="math_inline"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, { 'data-type': 'math_inline' }),
      0,
    ];
  },
});

export const MathBlock = Node.create({
  name: 'math_block',
  group: 'block',
  content: 'text*',

  parseHTML() {
    return [
      {
        tag: 'div[data-type="math_block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'math_block' }),
      0,
    ];
  },
});
