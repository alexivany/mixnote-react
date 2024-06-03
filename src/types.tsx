export type Song = {
  id: number;
  title: string;
  updated: string;
  key: string;
  bpm: string;
  tags: string[];
} & {
  [version: string]: Version;
};

export type Version = {
  color: string;
  version: string;
  generalNotes: string;
} & {
  [instrument: string]: {
    [properties: string]: string;
  };
};
