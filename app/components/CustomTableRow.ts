import { mergeAttributes, Node } from "@tiptap/core";

export const CustomTableRow = Node.create({
  name: "table_row",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  content: "(tableCell | tableHeader)*",

  tableRole: "row",

  parseHTML() {
    return [{ tag: "tr" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["tr", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
});
