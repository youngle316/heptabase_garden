import { Mark } from "@tiptap/core";

const CustomColor = Mark.create({
  name: "color",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  parseHTML() {
    return [
      {
        style: "color",
      },
      {
        style: "background-color",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    let styleString = "line-height: inherit;";

    if (HTMLAttributes.type === "background") {
      if (HTMLAttributes.color) {
        styleString += ` background-color: var(--bg-${HTMLAttributes.color}-editor); display: inline-block; height: 100%;`;
      }
    } else {
      if (HTMLAttributes.color) {
        styleString += ` color: var(--text-${HTMLAttributes.color}-editor);`;
      }
    }

    return ["span", { style: styleString }, 0];
  },

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => {
          return element.style.color || element.style.backgroundColor || null;
        },
        renderHTML: (attributes) => {
          if (!attributes.color) {
            return {};
          }

          return {
            color: attributes.color,
          };
        },
      },
      type: {
        default: "text",
        parseHTML: (element) => {
          return element.style.backgroundColor ? "background" : "text";
        },
        renderHTML: (attributes) => {
          return {
            type: attributes.type || "text",
          };
        },
      },
    };
  },
});

export default CustomColor;
