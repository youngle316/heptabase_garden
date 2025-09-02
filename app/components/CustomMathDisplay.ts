import { Node } from "@tiptap/core";

export const CustomMathDisplay = Node.create({
  name: "math_display",
  group: "block",
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
        tag: "div[data-type='math']",
      },
    ];
  },

  renderHTML({ node }) {
    const textContent = node.textBetween(0, node.content.size, "");

    return [
      "div",
      {
        class: "math-display katex",
        "data-type": "math",
        "data-formula": textContent,
      },
      0,
    ];
  },
});

export default CustomMathDisplay;
