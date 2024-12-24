import { Node } from '@tiptap/core';

// 定义自定义 li 节点
const Li = Node.create({
  name: 'li',
  group: 'block',
  content: 'inline*',
  parseHTML() {
    return [
      {
        tag: 'li',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['li', HTMLAttributes, 0];
  },
});

export default Li;
