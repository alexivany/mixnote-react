export type Song = {
  id: number | string;
  title: string;
  updated: string;
  key: string;
  bpm: string;
  tags: string[];
} & {
  [version: string]: Version;
};

export type Version = {
  theme: {
    activeColor: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  };
  version: string;
  generalNotes: string;
} & {
  [instrument: string]: {
    [properties: string]: string;
  };
};
