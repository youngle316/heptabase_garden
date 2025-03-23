import { generateCardHTML } from '@/utils/generateCardHTML';
import { parseNode } from '@/utils/heptabaseFunction';
import { Node, mergeAttributes } from '@tiptap/core';

export default Node.create({
  name: 'embed',
  group: 'block',
  content: 'inline*',

  addOptions() {
    return {
      highlightData: [],
      cards: [],
      allMediaCards: [],
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
    const allMediaCards = this.options.allMediaCards || [];
    const highlight = highlightData.find(
      (h: HightlightElement) => h.id === node.attrs.objectId,
    );
    const card = cards.find((c: Card) => c.id === node.attrs.objectId);

    const mediaCard = allMediaCards.find(
      (m: MediaCard) => m.id === node.attrs.objectId,
    );

    const cardContent = card?.content
      ? generateCardHTML({
          content: JSON.parse(card?.content)?.content,
          highlightData,
          cards,
          mentionInfos,
          allMediaCards,
        })
      : '';

    const htmlContent = highlight?.highlight?.content
      ? generateCardHTML({
          content: highlight?.highlight?.content,
          highlightData,
          cards,
          mentionInfos,
          allMediaCards,
        })
      : '';

    const noteContent = highlight?.note?.content
      ? generateCardHTML({
          content: highlight?.note?.content,
          highlightData,
          cards,
          mentionInfos,
          allMediaCards,
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

    if (mediaCard && mediaCard.type === 'video') {
      const generateVideoUrl = () => {
        if (!mediaCard.link) return '';

        const url = mediaCard.link;

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          const videoId = url.includes('youtube.com')
            ? url.split('v=')[1]?.split('&')[0]
            : url.split('youtu.be/')[1]?.split('?')[0];

          if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
          }
        }

        if (url.includes('bilibili.com')) {
          const bvid = url.match(/BV\w+/)?.[0];
          if (bvid) {
            return `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&autoplay=false`;
          }
        }
        return url;
      };

      return [
        'div',
        mergeAttributes(
          {
            'data-node-type': 'video',
            'data-node-id': node.attrs.id,
            class:
              'transition-[width] duration-300 ease-out w-full my-2 self-center',
            style: 'width: 100%;',
          },
          HTMLAttributes,
        ),
        [
          'div',
          {
            class: 'relative w-full cursor-pointer overflow-hidden touch-none',
          },
          [
            'div',
            {
              class: '',
              style: 'aspect-ratio: 1.77778 / 1;',
            },
            [
              'div',
              { class: 'size-full' },
              [
                'iframe',
                {
                  class: 'block size-full',
                  frameborder: '0',
                  allowfullscreen: '',
                  allow:
                    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
                  referrerpolicy: 'strict-origin-when-cross-origin',
                  title: 'Video player',
                  width: '640',
                  height: '360',
                  src: generateVideoUrl(),
                },
              ],
            ],
          ],
        ],
      ];
    }
    return ['div'];
  },
});
