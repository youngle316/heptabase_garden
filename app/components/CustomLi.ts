import { Node } from "@tiptap/core";

const Li = Node.create({
  name: "li",
  group: "block",
  content: "inline*",
  parseHTML() {
    return [
      {
        tag: "li",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["li", HTMLAttributes, 0];
  },
});

export default Li;
