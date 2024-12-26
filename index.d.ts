type Card = {
  createdTime: string;
  id: string;
  content: string;
  lastEditedTime: string;
  title: string;
};

type NumberedListItem = {
  type: 'numbered_list_item';
  attrs: ContentAttrs & {
    order: number | null;
  };
  content: LiContent[];
};

// 更新 Content 类型
type Content = BulletListItem | NumberedListItem;
