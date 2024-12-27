import { Node, mergeAttributes } from '@tiptap/core';

export interface TodoListItemOptions {
  HTMLAttributes: Record<string, string>;
}

export const TodoListItem = Node.create<TodoListItemOptions>({
  name: 'todo_list_item',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: 'block',

  content: 'paragraph+',

  defining: true,

  priority: 100,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute('id'),
        renderHTML: (attributes) => ({ id: attributes.id }),
      },
      checked: {
        default: false,
        parseHTML: (element) => element.dataset.checked === 'true',
        renderHTML: (attributes) => ({
          'data-checked': attributes.checked,
        }),
      },
      parentId: {
        default: null,
        parseHTML: (element) => element.getAttribute('parentid'),
        renderHTML: (attributes) => ({ parentid: attributes.parentId }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="todo-item"]',
        getAttrs: (element) => ({
          id: element.getAttribute('id'),
          checked: element.dataset.checked === 'true',
          parentId: element.getAttribute('parentid'),
        }),
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        {
          'data-type': 'todo-item',
          class: 'todo-list-item',
        },
        HTMLAttributes,
      ),
      [
        'div',
        {
          class: 'bullet-wrapper',
          contenteditable: 'false',
        },
        [
          'div',
          { class: 'checkbox-container' },
          [
            'span',
            {
              class: `${node.attrs.checked ? 'bg-active' : 'border-[1.5px] border-solid border-primary'} box-border flex h-4 w-4 items-center justify-center rounded-[3px] transition-bg ease-out`,
            },
            [
              'svg',
              {
                viewBox: '0 0 16 16',
                xmlns: 'http://www.w3.org/2000/svg',
                class: `h-4 w-4 shrink-0 fill-background ${node.attrs.checked ? '' : 'hidden'}`,
              },
              [
                'path',
                {
                  d: 'm13.0325 4.4075c-.0697-.07029-.1527-.12609-.2441-.16417-.0914-.03807-.1894-.05768-.2884-.05768s-.197.01961-.2884.05768c-.0914.03808-.1744.09388-.2441.16417l-5.5875 5.595-2.3475-2.355c-.07239-.06993-.15785-.12491-.25149-.16181-.09364-.03691-.19363-.05501-.29427-.05326-.10063.00174-.19994.02328-.29225.0634s-.17581.09803-.24574.17042-.12491.15785-.16182.25149c-.0369.09364-.055.19364-.05326.29427.00174.10064.02329.19994.06341.29225s.09803.17581.17042.24574l2.88 2.88c.06972.0703.15267.1261.24407.1642.09139.038.18942.0577.28843.0577s.19704-.0197.28843-.0577c.0914-.0381.17435-.0939.24407-.1642l6.12-6.12c.0761-.07023.1369-.15547.1784-.25034.0416-.09488.063-.19733.063-.30091 0-.10357-.0214-.20603-.063-.3009-.0415-.09488-.1023-.18012-.1784-.25035z',
                },
              ],
            ],
          ],
        ],
      ],
      [
        'div',
        {
          class: `todo-content ${node.attrs.checked ? 'checked' : ''}`,
        },
        0,
      ],
    ];
  },
});

export default TodoListItem;
