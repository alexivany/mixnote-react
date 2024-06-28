interface BaseVersion {
  version: string;
  generalNotes: string;
  theme: {
    activeColor: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  };
}

interface InstrumentData {
  instrument: string;
  notes: string;
  label: string;
  tabs?: string;
  lyrics?: string;
}

export type Version = BaseVersion & Partial<InstrumentData>;

// export type Version = BaseVersion & {
//   [instrument: string]: Partial<InstrumentData>;
// };

export type Song = {
  id: string;
  title: string;
  updated?: string;
  key?: string;
  bpm?: string;
  tags?: string[];
} & {
  [version: string]: Version;
};
