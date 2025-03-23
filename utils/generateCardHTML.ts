import CustomCard from '@/components/CustomCard';
import CustomColor from '@/components/CustomColor';
import CustomDate from '@/components/CustomDate';
import CustomEmbed from '@/components/CustomEmbed';
import Li from '@/components/CustomLi';
import { MathBlock, MathInline } from '@/components/CustomMath';
import { CustomPDFCard } from '@/components/CustomPDFCard';
import CustomSection from '@/components/CustomSection';
import { CustomTableCell } from '@/components/CustomTableCell';
import { CustomTableRow } from '@/components/CustomTableRow';
import CustomTodoListItem from '@/components/CustomTodoList';
import { ToggleListItem } from '@/components/CustomToggleList';
import CustomVideo from '@/components/CustomVideo';
import CustomWhiteboard from '@/components/CustomWhiteboard';
import {
  transformBulletList,
  transformListItems,
} from '@/utils/heptabaseFunction';
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

export function generateCardHTML({
  content,
  highlightData,
  cards,
  mentionInfos,
  allMediaCards,
}: {
  content: [];
  highlightData: HightlightElement[] | [];
  cards: Card[] | [];
  mentionInfos: MentionInfo[] | [];
  allMediaCards: MediaCard[] | [];
}) {
  const transformedContent = transformListItems(content).map(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (item: any) => transformBulletList(item),
  );

  return content
    ? generateHTML(
        {
          type: 'doc',
          content: transformedContent,
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
          CustomWhiteboard.configure({ mentionInfos }),
          CustomSection,
          CustomEmbed.configure({ highlightData, cards, allMediaCards }),
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
              return [
                'img',
                {
                  class: 'cursor-zoom-in image-skeleton',
                  loading: 'lazy',
                  style:
                    'background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; min-height: 100px; min-width: 100%;',
                  onload:
                    "this.style.background='none'; this.style.animation='none'; this.style.minHeight='0'; this.style.minWidth='0';",
                  ...HTMLAttributes,
                },
              ];
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
          CustomDate.configure({ cards }),
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
          CustomCard.configure({ cards, mentionInfos }),
          Li,
          OrderedList.extend({
            name: 'numbered_list_item',
          }),
          ListItem,
          BulletList.extend({
            name: 'bullet_list_item',
          }),
          CustomPDFCard.configure({ mentionInfos }),
        ],
      )
    : '';
}
