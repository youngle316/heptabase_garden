import { Mark } from '@tiptap/core';

const CustomColor = Mark.create({
  name: 'color',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  parseHTML() {
    return [
      {
        style: 'color',
      },
      {
        style: 'background-color',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const baseStyle = { lineHeight: 'inherit' };

    const colorStyle =
      HTMLAttributes.type === 'background'
        ? {
            ...baseStyle,
            backgroundColor: HTMLAttributes.color
              ? `var(--bg-${HTMLAttributes.color}-editor)`
              : undefined,
            display: 'inline-block',
            height: '100%',
          }
        : {
            color: HTMLAttributes.color
              ? `var(--text-${HTMLAttributes.color}-editor)`
              : undefined,
          };

    return ['span', { style: colorStyle }, 0];
  },

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => {
          return element.style.color || element.style.backgroundColor || null;
        },
        renderHTML: (attributes) => {
          if (!attributes.color) {
            return {};
          }

          return {
            color: attributes.color,
          };
        },
      },
      type: {
        default: 'text',
        parseHTML: (element) => {
          return element.style.backgroundColor ? 'background' : 'text';
        },
      },
    };
  },
});

export default CustomColor;
