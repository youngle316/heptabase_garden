import { Node } from "@tiptap/core";
import type { MentionInfo } from "~/types";

export const CustomWhiteboard = Node.create({
  name: "whiteboard",
  group: "inline",
  inline: true,

  addOptions() {
    return {
      mentionInfos: [],
    };
  },

  addAttributes() {
    return {
      whiteboardId: {
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
        tag: 'span[contenteditable="false"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const mentionInfos = this.options.mentionInfos as MentionInfo["data"][];
    const whiteboardId = HTMLAttributes.whiteboardId;
    const whiteboard = mentionInfos.find((info) => info.id === whiteboardId);

    return [
      "span",
      { class: "rounded-sm text-active" },
      [
        "svg",
        {
          fill: "none",
          viewBox: "0 0 24 24",
          xmlns: "http://www.w3.org/2000/svg",
          class: "mr-1.5 mt-0.5 h-[1.06em] align-text-top inline",
          style: "fill: var(--map-color-svg);",
        },
        [
          "path",
          {
            d: "m21.32 5.04999-6-2h-.07c-.0465-.00467-.0934-.00467-.14 0h-.23-.13-.07l-5.68 1.95-5.68-1.95c-.15038-.04958-.31039-.06275-.46686-.03841s-.30492.08549-.43314.17841c-.12924.09202-.23473.21347-.30776.35431s-.1115.29704-.11224.45569v14.00001c-.00054.2096.06482.4141.18685.5846.12202.1705.29453.2983.49315.3654l6 2c.20145.0657.41856.0657.62 0l5.7-1.9 5.68 1.95c.1062.0144.2138.0144.32 0 .2091.0029.4132-.0639.58-.19.1292-.092.2347-.2135.3078-.3543.073-.1409.1115-.2971.1122-.4557v-14.00001c.0005-.20964-.0648-.41415-.1868-.58463-.1221-.17047-.2946-.29828-.4932-.36537zm-13.32 13.56001-4-1.33v-11.89001l4 1.33zm6-1.33-4 1.33v-11.89001l4-1.33zm6 1.33-4-1.33v-11.89001l4 1.33z",
          },
        ],
      ],
      [
        "span",
        {
          class: "border-b-solid border-b border-light-grey text-middle-hard-grey",
        },
        whiteboard?.title || "Untitled Whiteboard",
      ],
    ];
  },
});

export default CustomWhiteboard;
