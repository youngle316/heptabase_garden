import { Node, mergeAttributes } from '@tiptap/core';

export interface TableCellOptions {
  /**
   * The HTML attributes for a table cell node.
   * @default {}
   * @example { class: 'foo' }
   */
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  HTMLAttributes: Record<string, any>;
}

/**
 * This extension allows you to create table cells.
 * @see https://www.tiptap.dev/api/nodes/table-cell
 */
export const CustomTableCell = Node.create<TableCellOptions>({
  name: 'table_cell',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  content: 'block+',

  addAttributes() {
    return {
      colspan: {
        default: 1,
      },
      rowspan: {
        default: 1,
      },
      colwidth: {
        default: null,
        parseHTML: (element) => {
          const colwidth = element.getAttribute('colwidth');
          const value = colwidth
            ? colwidth.split(',').map((width) => Number.parseInt(width, 10))
            : null;

          return value;
        },
      },
    };
  },

  tableRole: 'cell',

  isolating: true,

  parseHTML() {
    return [{ tag: 'td' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'td',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});
