import CustomCard from '@/components/CustomCard';
import CustomColor from '@/components/CustomColor';
import CustomDate from '@/components/CustomDate';
import CustomEmbed from '@/components/CustomEmbed';
import Li from '@/components/CustomLi';
import { MathBlock, MathInline } from '@/components/CustomMath';
import CustomSection from '@/components/CustomSection';
import { CustomTableCell } from '@/components/CustomTableCell';
import { CustomTableRow } from '@/components/CustomTableRow';
import CustomTodoListItem from '@/components/CustomTodoList';
import { ToggleListItem } from '@/components/CustomToggleList';
import CustomVideo from '@/components/CustomVideo';
import CustomWhiteboard from '@/components/CustomWhiteboard';
import { Node } from '@tiptap/core';
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import { Document } from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Image from '@tiptap/extension-image';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Text from '@tiptap/extension-text';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { generateHTML } from '@tiptap/html';

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
    const highlight = highlightData.find(
      (h: HightlightElement) => h.id === node.attrs.objectId,
    );

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const generateHTMLByTiptap = (content: any) => {
      return generateHTML(
        {
          type: 'doc',
          content: content,
        },
        [
          Document,
          Paragraph,
          Text,
          TextStyle,
          Heading,
          Strike,
          CustomColor,
          MathInline,
          MathBlock,
          ToggleListItem,
          Code,
          Blockquote,
          CustomWhiteboard,
          CustomSection,
          CustomEmbed.configure({ highlightData }),
          HardBreak.extend({
            name: 'hard_break',
          }),
          Italic.extend({
            name: 'em',
          }),
          Image.extend({
            renderHTML({ HTMLAttributes }) {
              if (!HTMLAttributes.src) {
                return ['div', {}];
              }
              return ['img', HTMLAttributes];
            },
          }),
          Table,
          TableCell,
          CustomTableCell,
          TableHeader,
          TableRow,
          CustomTableRow,
          CustomTodoListItem,
          CustomVideo,
          CustomDate,
          HorizontalRule.extend({
            name: 'horizontal_rule',
          }),
          CodeBlock.extend({
            name: 'code_block',
            addAttributes() {
              return {
                id: {
                  default: null,
                },
                params: {
                  default: null,
                },
                parentId: {
                  default: null,
                },
              };
            },
            renderHTML({ HTMLAttributes }) {
              const language = HTMLAttributes.params || '';
              return [
                'pre',
                {},
                ['code', { class: `language-${language}` }, 0],
              ];
            },
          }),
          Bold.extend({
            name: 'strong',
          }),
          Underline.extend({
            name: 'underline',
          }),
          Link.extend({
            name: 'link',
          }),
          CustomCard.configure({ cards }),
          Li,
          OrderedList.extend({
            name: 'numbered_list_item',
          }),
          ListItem,
          BulletList.extend({
            name: 'bullet_list_item',
          }),
        ],
      );
    };

    const htmlContent = highlight?.highlight?.content
      ? generateHTMLByTiptap(highlight?.highlight?.content)
      : '';

    const noteContent = highlight?.note?.content
      ? generateHTMLByTiptap(highlight?.note?.content)
      : '';

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const parserNote = new DOMParser();
    const docNote = parserNote.parseFromString(noteContent, 'text/html');

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const parseNode = (node: Element): any[] => {
      const tagName = node.tagName.toLowerCase();
      const attrs: Record<string, string> = {};

      for (const attr of node.attributes) {
        attrs[attr.name] = attr.value;
      }

      const children = Array.from(node.childNodes)
        .map((child) => {
          if (child.nodeType === 1) {
            return parseNode(child as Element);
          }

          if (child.nodeType === 3) {
            const text = child.textContent?.trim();
            return text ? text : '';
          }

          return '';
        })
        .filter(Boolean);

      return [tagName, attrs, ...children];
    };

    const childNodes = Array.from(doc.body.children).map((child) =>
      parseNode(child),
    );

    const childNodesNote = Array.from(docNote.body.children).map((child) =>
      parseNode(child),
    );

    const isNoteEmpty = highlight?.note?.content[0].attrs.id === null;

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
  },
});
