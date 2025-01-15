type Card = {
  createdTime: string;
  id: string;
  content: string;
  lastEditedTime: string;
  title: string;
  date: string;
};

type Journal = Card & {};

type NumberedListItem = {
  type: 'numbered_list_item';
  attrs: ContentAttrs & {
    order: number | null;
  };
  content: LiContent[];
};

// 更新 Content 类型
type Content = BulletListItem | NumberedListItem;

type SourceLocation = {
  readwiseHighlightId: string;
  readwiseHighlightReadwiseUrl: string;
  readwiseHighlightUrl: string;
};

type HightlightElement = {
  color: string;
  createdTime: string;
  id: string;
  lastEditedTime: string;
  type: string;
  sourceLocation: SourceLocation;
  highlight: {
    type: string;
    content: Array;
  };
};

type MentionInfo = {
  title: string;
  id: string;
};
