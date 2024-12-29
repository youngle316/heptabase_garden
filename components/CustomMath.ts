import { Node, mergeAttributes } from '@tiptap/core';
import { MathpixMarkdownModel as MM } from 'mathpix-markdown-it';

const initMathpixStyles = () => {
  if (typeof document !== 'undefined') {
    const elStyle = document.getElementById('Mathpix-styles');
    if (!elStyle) {
      const style = document.createElement('style');
      style.setAttribute('id', 'Mathpix-styles');
      style.innerHTML = MM.getMathpixFontsStyle() + MM.getMathpixStyle(true);
      document.head.appendChild(style);
    }
  }
};

initMathpixStyles();

export const MathInline = Node.create({
  name: 'math_inline',
  group: 'inline',
  inline: true,
  content: 'text*',

  parseHTML() {
    return [{ tag: 'span[data-type="math_inline"]' }];
  },

  renderHTML({ node }) {
    const content = node.textContent;

    return [
      'span',
      mergeAttributes({
        'data-type': 'math_inline',
        'data-math': content,
        class: 'math-content math-inline',
      }),
      0,
    ];
  },
});

export const MathBlock = Node.create({
  name: 'math_display',
  group: 'block',
  content: 'text*',

  parseHTML() {
    return [{ tag: 'div[data-type="math_block"]' }];
  },

  renderHTML({ node }) {
    const content = node.textContent;

    return [
      'div',
      mergeAttributes({
        'data-type': 'math_block',
        'data-math': content,
        class: 'math-content math-block',
      }),
      0,
    ];
  },
});
