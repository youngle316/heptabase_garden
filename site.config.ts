export const CONFIG = {
  title: "数字花园🌿",
  description: "Use heptabase to build your digital garden",
  whiteboardId: "641ea3e118cf2f1d33cda32e8580f77efa59094fc805b326c9fc8c6dd16489ee",
  coverImage: "https://3aed3bd.webp.li/heptabase_coverimage.png",
  cache: {
    maxAge: 60 * 60 * 1000,
    staleWhileRevalidate: 10 * 60 * 1000,
  },
};

export const SEO = {
  title: CONFIG.title,
  description: CONFIG.description,
  coverImage: CONFIG.coverImage,
};

export const Nav = [
  {
    label: "Run",
    pageId: "https://run.yanglele.cc",
  },
];

export const umamiTrackId = "203ac7a7-a2bb-4f8b-b581-3724f6163543";
export const umamiHost = "https://umami.yanglele.cc/script.js";
