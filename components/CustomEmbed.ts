import { generateCardHTML } from '@/utils/generateCardHTML';
import { parseNode } from '@/utils/heptabaseFunction';
import { Node } from '@tiptap/core';

export default Node.create({
  name: 'embed',
  group: 'block',
  content: 'inline*',

  addOptions() {
    return {
      highlightData: [],
      cards: [],
    };
  },

  addAttributes() {
    return {
      id: {
        default: null,
      },
      objectId: {
        default: null,
      },
      alignment: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="embed"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const highlightData = this.options.highlightData || [];
    const cards = this.options.cards || [];
    const mentionInfos = this.options.mentionInfos || [];

    const highlight = highlightData.find(
      (h: HightlightElement) => h.id === node.attrs.objectId,
    );
    const card = cards.find((c: Card) => c.id === node.attrs.objectId);

    const cardContent = card?.content
      ? generateCardHTML({
          content: JSON.parse(card?.content)?.content,
          highlightData,
          cards,
          mentionInfos,
        })
      : '';

    const htmlContent = highlight?.highlight?.content
      ? generateCardHTML({
          content: highlight?.highlight?.content,
          highlightData,
          cards,
          mentionInfos,
        })
      : '';

    const noteContent = highlight?.note?.content
      ? generateCardHTML({
          content: highlight?.note?.content,
          highlightData,
          cards,
          mentionInfos,
        })
      : '';

    const parseCard = new DOMParser();
    const docCard = parseCard.parseFromString(cardContent, 'text/html');

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const parserNote = new DOMParser();
    const docNote = parserNote.parseFromString(noteContent, 'text/html');

    const childNodesCard = Array.from(docCard.body.children).map((child) =>
      parseNode(child),
    );

    const childNodes = Array.from(doc.body.children).map((child) =>
      parseNode(child),
    );

    const childNodesNote = Array.from(docNote.body.children).map((child) =>
      parseNode(child),
    );

    const isNoteEmpty = !highlight?.note?.content[0].content;

    if (highlight) {
      return [
        'div',
        {
          'data-type': 'embed',
          class: 'relative my-[0.5rem]',
          ...HTMLAttributes,
        },
        [
          'div',
          { class: 'rounded border border-foreground/10 border-solid py-4' },
          [
            'div',
            { class: 'flex' },
            [
              'div',
              {
                class: 'shrink-0 rounded-r-sm w-1',
                style: `background-color: var(--annotation-${highlight?.color})`,
              },
            ],
            [
              'div',
              {
                class:
                  'ml-3 mr-4 rounded bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,255,255,0.06)] dark:text-[rgba(255,255,255,0.65)] overflow-x-hidden grow',
              },
              [
                'div',
                [
                  'div',
                  {
                    class: 'py-[3px] px-[0.75rem]',
                  },
                  ...childNodes,
                ],
              ],
            ],
          ],
          isNoteEmpty
            ? ['div']
            : [
                'div',
                { class: 'pt-[0.5rem] px-[1.75rem] pb-0' },
                ...childNodesNote,
              ],
        ],
      ];
    }

    if (card) {
      return [
        'div',
        {
          'data-type': 'embed',
          class: 'relative my-[0.5rem]',
          ...HTMLAttributes,
        },
        [
          'div',
          {
            class:
              'py-6 px-7 bg-ultra-light-grey border-light-grey border border-solid rounded',
          },
          ...childNodesCard,
        ],
      ];
    }

    return ['div'];
  },
});
