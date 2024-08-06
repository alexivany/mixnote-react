interface BaseVersion {
  version: string;
  generalNotes: string;
  theme: {
    activeColor: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    hoverColor: string;
  };
}

export interface InstrumentData {
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
  bpm?: number;
  tags?: string[];
} & {
  [version: string]: Version;
};

export type Modal = {
  about: string;
  lines: number;
  section: string;
  mood: string;
  poetic: number;
};

export type DrumSeq = {
  sound: string;
  note: string;
  isActive: boolean;
};

export type LyricModalInput = {
  about: string;
  lines: number;
  section: string;
  mood: string;
  poetic: number;
};
