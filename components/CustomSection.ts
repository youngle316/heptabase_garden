import { Node, mergeAttributes } from '@tiptap/core';

const CustomSection = Node.create({
  name: 'section',

  group: 'block',

  content: 'inline*',

  defining: true,

  parseHTML() {
    return [
      {
        tag: 'section',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const sectionId = HTMLAttributes.sectionId || '';

    return [
      'p',
      mergeAttributes(HTMLAttributes, {
        'data-node-type': 'paragraph',
        'data-node-id': sectionId,
        class: 'relative',
      }),
      [
        'span',
        [
          'span',
          {
            class:
              'rounded-sm text-active flex items-center select-none cursor-default',
          },
          [
            'svg',
            {
              fill: 'none',
              viewBox: '0 0 24 24',
              xmlns: 'http://www.w3.org/2000/svg',
              class: 'mr-1.5 mt-0.5 h-[1.06em] align-text-top',
              style: 'fill: var(--border-white-sect)',
            },
            [
              'path',
              {
                d: 'm22.1213 1.87868c-.5626-.56261-1.3257-.87868-2.1213-.87868h-2c-.5523 0-1 .44772-1 1s.4477 1 1 1h2c.2652 0 .5196.10536.7071.29289.1875.18754.2929.44189.2929.70711v16c0 .2652-.1054.5196-.2929.7071s-.4419.2929-.7071.2929h-16c-.26522 0-.51957-.1054-.70711-.2929-.18753-.1875-.29289-.4419-.29289-.7071v-10c0-.55229-.44772-1-1-1s-1 .44771-1 1v10c0 .7956.31607 1.5587.87868 2.1213s1.32567.8787 2.12132.8787h16c.7956 0 1.5587-.3161 2.1213-.8787s.8787-1.3257.8787-2.1213v-16c0-.79565-.3161-1.55871-.8787-2.12132z',
              },
            ],
            [
              'path',
              {
                'clip-rule': 'evenodd',
                d: 'm1.94627 6.12132c-.60589-.56261-.94627-1.32567-.94627-2.12132s.34038-1.55871.94627-2.12132 1.42765-.87868 2.2845-.87868h7.53843c.8569 0 1.6786.31607 2.2845.87868s.9463 1.32567.9463 2.12132-.3404 1.55871-.9463 2.12132-1.4276.87868-2.2845.87868h-7.53843c-.85685 0-1.67861-.31607-2.2845-.87868zm10.58443-2.82843c-.2019-.18753-.4759-.29289-.7615-.29289h-7.53843c-.28562 0-.55954.10536-.7615.29289-.20196.18754-.31542.44189-.31542.70711s.11346.51957.31542.70711c.20196.18753.47588.29289.7615.29289h7.53843c.2856 0 .5596-.10536.7615-.29289.202-.18754.3155-.44189.3155-.70711s-.1135-.51957-.3155-.70711z',
                'fill-rule': 'evenodd',
              },
            ],
          ],
          [
            'span',
            {
              class:
                'border-b-solid border-b border-light-grey text-middle-hard-grey',
            },
            sectionId,
          ],
        ],
      ],
    ];
  },

  addAttributes() {
    return {
      sectionId: {
        default: null,
      },
      parentId: {
        default: null,
      },
    };
  },
});

export default CustomSection;
