import { Node } from "@tiptap/core";
import type { Card, MentionInfo } from "~/types";

const CustomCard = Node.create({
  name: "card",
  group: "block",
  content: "inline*",
  addOptions() {
    return {
      cards: [],
      mentionInfos: [],
    };
  },
  addAttributes() {
    return {
      text: "",
      cardId: "",
      parentId: "",
    };
  },
  renderHTML({ HTMLAttributes, node }) {
    const cards = this.options.cards || [];
    const cardId = node.attrs.cardId;
    const card = cards.find((c: Card) => c.id === cardId);
    const parentId = node.attrs.parentId;

    const mentionInfos = this.options.mentionInfos || [];
    const mentionInfo = mentionInfos.find((m: MentionInfo["data"]) => m.id === cardId);

    return [
      "span",
      {
        ...HTMLAttributes,
        "data-type": "card",
        "data-card-id": cardId,
        class: `card ${card ? "" : "invalid-card"} card-hover-trigger`,
        "data-parent-id": parentId,
        noreferrer: card ? undefined : "true",
      },
      [
        "span",
        {
          class:
            "border-b-solid border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.08)]",
        },
        card ? card.title : mentionInfo?.title || "Invalid Card",
      ],
    ];
  },
});

export default CustomCard;
