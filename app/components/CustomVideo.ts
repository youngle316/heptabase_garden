import { mergeAttributes, Node } from "@tiptap/core";

export const CustomVideo = Node.create({
  name: "video",

  group: "block",

  addAttributes() {
    return {
      id: {
        default: null,
      },
      fileId: {
        default: null,
      },
      url: {
        default: null,
      },
      source: {
        default: "video",
      },
      width: {
        default: "100%",
      },
      alignment: {
        default: "center",
      },
      originalWidth: {
        default: null,
      },
      originalHeight: {
        default: null,
      },
      reference: {
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
        tag: 'div[data-node-type="video"]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const generateVideoUrl = (url: string) => {
      if (!url) return "";

      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const videoId = url.includes("youtube.com")
          ? url.split("v=")[1]?.split("&")[0]
          : url.split("youtu.be/")[1]?.split("?")[0];

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      if (url.includes("bilibili.com")) {
        const bvid = url.match(/BV\w+/)?.[0];
        if (bvid) {
          return `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&autoplay=false`;
        }
      }
      return url;
    };

    return [
      "div",
      mergeAttributes(
        {
          "data-node-type": "video",
          "data-node-id": node.attrs.id,
          class: `${!node.attrs.url && "hidden"} transition-[width] duration-300 ease-out w-full my-2 self-center`,
          style: "width: 100%;",
        },
        HTMLAttributes,
      ),
      [
        "div",
        {
          class: "relative w-full cursor-pointer overflow-hidden touch-none",
        },
        [
          "div",
          {
            class: "",
            style: "aspect-ratio: 1.77778 / 1;",
          },
          [
            "div",
            { class: "size-full" },
            [
              "iframe",
              {
                class: "block size-full",
                frameborder: "0",
                allowfullscreen: "",
                allow:
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
                referrerpolicy: "strict-origin-when-cross-origin",
                title: "Video player",
                width: "640",
                height: "360",
                src: generateVideoUrl(node.attrs.url),
              },
            ],
          ],
        ],
      ],
    ];
  },
});

export default CustomVideo;
