export type TiptapAttrs = {
  id: string;
  level: number;
  parentId?: string;
  cardId?: string;
  date?: string;
};

export type TiptapNode = {
  type: string;
  attrs?: TiptapAttrs;
  content?: TiptapNode[];
  text?: string;
  marks?: Array<{
    type: string;
    attrs?: TiptapAttrs;
  }>;
};

export type TiptapDocument = {
  type: "doc";
  content: TiptapNode[];
};

export type CardInstance = {
  cardId: string;
  color: string;
  createdBy: string;
  createdTime: string;
  foldedHeight: number;
  height: number;
  id: string;
  isAutoHeight: boolean;
  isFolded: boolean;
  lastEditedTime: string;
  sourceSpaceId: string;
  spaceId: string;
  whiteboardId: string;
  width: number;
  x: number;
  y: number;
};

export type Card = {
  content: string;
  parsedContent?: TiptapDocument;
  createdBy: string;
  createdTime: string;
  id: string;
  insights: string[];
  isTrashed: boolean;
  lastEditedTime: string;
  lastUsedTime: string;
  propertiesConfig: string[];
  sourceCardId: string | null;
  sourceCardType: string | null;
  spaceId: string;
  title: string;
  wasInsightGenerated: boolean;
  isJournal?: boolean;
};

export type Journal = {
  content: string;
  parsedContent?: TiptapDocument;
  createdBy: string;
  createdTime: string;
  date: string;
  insights: string[];
  lastEditedTime: string;
  lastUsedTime: string;
  propertiesConfig: string[];
  spaceId: string;
  wasInsightGenerated: boolean;
};

export type MediaCard = {
  coverFileId: string | null;
  createdBy: string;
  createdTime: string;
  fileId: string | null;
  id: string;
  insights: string[];
  isTrashed: boolean;
  lastEditedTime: string;
  lastUsedTime: string;
  link: string;
  propertiesConfig: string[];
  spaceId: string;
  title: string;
  transcript: {
    status: string;
    transcriptEntries: {
      content: string;
      end: number;
      id: string;
      start: number;
      type: string;
    }[];
  };
  type: string;
};

export type MentionInfo = {
  type: string;
  data: {
    title: string;
    id: string;
  };
};

export type HighlightElement = {
  color: string;
  createdBy: string;
  createdTime: string;
  highlight: TiptapDocument;
  id: string;
  insights: string[];
  isTrashed: boolean;
  lastEditedTime: string;
  lastUsedTime: string;
  metadata: {
    isNoteEdited: boolean;
    isHighlightEdited: boolean;
    location: number;
  };
  propertiesConfig: string[];
  sourceId: string;
  sourceLocation: {
    readwiseHighlightId: string;
    readwiseHighlightReadwiseUrl: string;
    readwiseHighlightUrl: string;
  };
  spaceId: string;
  type: string;
  wasInsightGenerated: boolean;
};

export type CardContent = {
  activeWhiteboardId: string;
  cardInstances: CardInstance[];
  cards: Card[];
  journals: Journal[];
  mediaCards: MediaCard[];
  mentionInfos: MentionInfo[];
  highlightElements: HighlightElement[];
};

export interface LoaderData {
  cardContent: CardContent | null;
}
