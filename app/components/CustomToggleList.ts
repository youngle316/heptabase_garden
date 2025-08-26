import { mergeAttributes, Node } from "@tiptap/core";

export const ToggleListItem = Node.create({
  name: "toggle_list_item",
  group: "block",
  content: "paragraph block*",

  addAttributes() {
    return {
      id: {
        default: null,
      },
      folded: {
        default: false,
        parseHTML: (element) => element.hasAttribute("folded"),
        renderHTML: (attributes) => {
          if (!attributes.folded) {
            return {};
          }
          return { folded: "" };
        },
      },
      format: {
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
        tag: 'div[data-node-type="toggle_list_item"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const foldedClass = node.attrs.folded ? "folded" : "";
    const hasNestedBlocks = node.children.length > 1;
    const nestedClass = hasNestedBlocks ? "hasNestedBlocks" : "";

    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: `block ${foldedClass} toggle_list_item`,
        "data-node-type": "toggle_list_item",
        "data-node-id": node.attrs.id,
      }),
      [
        "div",
        {
          class: "bulletWrapper",
          contenteditable: "false",
        },
        [
          "div",
          {
            class: `${nestedClass}`,
          },
          [
            "span",
            { class: "flex items-center", style: "height: 34px;" },
            [
              "div",
              {
                class:
                  "bullet flex h-6 w-[22px] cursor-pointer items-center justify-center rounded transition-bg duration-100 ease-linear hover:bg-[rgba(0,0,0,0.08)] dark:hover:bg-[rgba(255,255,255,0.08)]",
                "data-toggle-trigger": "true",
                "data-type": "toggle_list_item_icon",
                "data-node-id": node.attrs.id,
              },
              [
                "svg",
                {
                  viewBox: "0 0 18 18",
                  xmlns: "http://www.w3.org/2000/svg",
                  class: "toggleIcon transition-transform duration-100 ease-linear w-4.5 h-4.5",
                },
                [
                  "path",
                  {
                    d: "m8.13311 12.8189c.39313.6414 1.34075.6414 1.73388 0l3.68681-6.01481c.4055-.66157-.0801-1.50416-.867-1.50416h-7.37354c-.78681 0-1.27245.84259-.86694 1.50416z",
                  },
                ],
              ],
            ],
          ],
        ],
      ],
      ["div", { class: "nestedBlocks" }, 0],
    ];
  },
});
