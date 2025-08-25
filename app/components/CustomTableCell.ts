import { mergeAttributes, Node } from "@tiptap/core";

export const CustomTableCell = Node.create({
  name: "table_cell",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  content: "block+",

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
          const colwidth = element.getAttribute("colwidth");
          const value = colwidth
            ? colwidth.split(",").map((width) => Number.parseInt(width, 10))
            : null;

          return value;
        },
      },
    };
  },

  tableRole: "cell",

  isolating: true,

  parseHTML() {
    return [{ tag: "td" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["td", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
});
