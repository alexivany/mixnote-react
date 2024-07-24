export const DEFAULT_DRUM_ARRAY = [
  Array.from({ length: 16 }, (_) => ({
    sound: "Kick",
    note: "C1",
    isActive: false,
  })),
  Array.from({ length: 16 }, (_) => ({
    sound: "Snare",
    note: "C2",
    isActive: false,
  })),
  Array.from({ length: 16 }, (_) => ({
    sound: "Hi-Hat",
    note: "C3",
    isActive: false,
  })),
  Array.from({ length: 16 }, (_) => ({
    sound: "Crash",
    note: "C4",
    isActive: false,
  })),
];
