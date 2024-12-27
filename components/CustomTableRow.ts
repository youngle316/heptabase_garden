import { Node, mergeAttributes } from '@tiptap/core';

export interface TableRowOptions {
  /**
   * The HTML attributes for a table row node.
   * @default {}
   * @example { class: 'foo' }
   */
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  HTMLAttributes: Record<string, any>;
}

/**
 * This extension allows you to create table rows.
 * @see https://www.tiptap.dev/api/nodes/table-row
 */
export const CustomTableRow = Node.create<TableRowOptions>({
  name: 'table_row',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  content: '(tableCell | tableHeader)*',

  tableRole: 'row',

  parseHTML() {
    return [{ tag: 'tr' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'tr',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});
