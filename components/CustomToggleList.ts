import { Node, mergeAttributes } from '@tiptap/core';

export const ToggleListItem = Node.create({
  name: 'toggle_list_item',
  group: 'block',
  content: 'paragraph block*',

  parseHTML() {
    return [
      {
        tag: 'div[data-type="toggle_list_item"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'toggle_list_item' }),
      0,
    ];
  },
});
