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
    const className =
      HTMLAttributes.type === 'background'
        ? `bg-${HTMLAttributes.color}-100 leading-[inherit] inline-block h-full`
        : `text-${HTMLAttributes.color}-600`;

    return ['span', { class: className }, 0];
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
