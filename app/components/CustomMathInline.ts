import { Node } from "@tiptap/core";

export const CustomMathInline = Node.create({
  name: "math_inline",
  group: "inline",
  inline: true,
  content: "text*",

  addAttributes() {
    return {
      id: {
        default: null,
      },
      parentId: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-type='math']",
      },
    ];
  },

  renderHTML({ node }) {
    const textContent = node.textBetween(0, node.content.size, "");

    return [
      "span",
      {
        class: "math-inline katex",
        "data-type": "math",
        "data-formula": textContent,
      },
      0,
    ];
  },
});

export default CustomMathInline;
