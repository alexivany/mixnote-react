import * as Tone from "tone";

import { useEffect, useMemo, useRef, useState } from "react";

import { useCurrentVersionContext } from "@/contexts/currentversion-context";

import isEqual from "lodash/isEqual";

import DrumRow from "./DrumRow";

import { DEFAULT_DRUM_ARRAY } from "./drummachine-utils";

import Kick from "../../assets/audio/Kick.wav";
import Snare from "../../assets/audio/SD.wav";
import HiHat from "../../assets/audio/CH.wav";
import Crash from "../../assets/audio/Crash.wav";

import { Version, DrumSeq } from "@/types";
import { useCurrentSongContext } from "@/contexts/currentsong-context";

export default function DrumMachine({ instrumentToTab }) {
  const { currentVersion, setCurrentVersion } = useCurrentVersionContext();
  const { currentSong } = useCurrentSongContext();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [drumSeqArray, setDrumSeqArray] = useState<DrumSeq[][]>();

  const seqRef = useRef<Tone.Sequence | null>(null);
  const drumMachineRef = useRef<Tone.Sampler | null>(null);

  const transport = Tone.getTransport();
  let beat = 0;

  // const drumMachine = useMemo(
  //   () =>
  //     new Tone.Sampler({
  //       urls: {
  //         C1: Kick,
  //         C2: Snare,
  //         C3: HiHat,
  //         C4: Crash,
  //       },
  //       onload: () => console.log("loaded"),
  //     }).toDestination(),
  //   []
  // );

  // const stepSeq = useMemo(() => {
  //   if (!drumSeqArray) return;

  //   return new Tone.Sequence(
  //     (time) => {
  //       if (drumSeqArray) {
  //         drumSeqArray.forEach((row) => {
  //           const step = row[beat];
  //           if (step.isActive) {
  //             drumMachine.triggerAttackRelease(step.note, "8n", time);
  //           }
  //         });
  //       }

  //       beat = (beat + 1) % 16;
  //       console.log(beat);
  //     },
  //     ["16n"]
  //   ).start(0);
  // }, [drumSeqArray]);

  const playSeq = async () => {
    if (!isPlaying && currentSong && seqRef.current && drumMachineRef.current) {
      await Tone.start();
      transport.bpm.value = currentSong.bpm as number;
      transport.start("+0.1");
      setIsPlaying(true);
    }
  };

  const stopSeq = () => {
    transport.stop();
    setIsPlaying(false);
  };

  const clearSeq = () => {
    console.log("cleared");
    setDrumSeqArray(DEFAULT_DRUM_ARRAY);
  };

  useEffect(() => {
    drumMachineRef.current = new Tone.Sampler({
      urls: {
        C1: Kick,
        C2: Snare,
        C3: HiHat,
        C4: Crash,
      },
    }).toDestination();

    seqRef.current = new Tone.Sequence(
      (time) => {
        if (drumSeqArray) {
          drumSeqArray.forEach((row) => {
            const step = row[beat];
            if (step.isActive) {
              drumMachineRef.current?.triggerAttackRelease(
                step.note,
                "8n",
                time
              );
            }
          });
        }

        beat = (beat + 1) % 16;
        console.log(beat);
      },
      [...Array(16).keys()],
      "16n"
    );

    seqRef.current.start(0);

    return () => {
      seqRef.current?.dispose();
      drumMachineRef.current?.dispose();
    };
  }, [drumSeqArray]);

  useEffect(() => {
    if (currentVersion) {
      if (currentVersion?.[instrumentToTab].drumSeq) {
        setDrumSeqArray(currentVersion?.[instrumentToTab].drumSeq);
      } else if (currentVersion?.[instrumentToTab]) {
        setDrumSeqArray(DEFAULT_DRUM_ARRAY);
      }
    }
  }, []);

  useEffect(() => {
    if (currentVersion) {
      if (currentVersion?.[instrumentToTab].drumSeq !== drumSeqArray) {
        setCurrentVersion((prevVersion) => {
          return {
            ...prevVersion,
            [instrumentToTab]: {
              ...prevVersion?.[instrumentToTab],
              drumSeq: drumSeqArray,
            },
          } as Version;
        });
      }
    }
  }, [drumSeqArray]);

  return (
    <>
      <div className="flex flex-col gap-1 w-full border border-gray-300 rounded-lg p-2 text-sm">
        {drumSeqArray &&
          drumSeqArray.map((row, i) => {
            return (
              <DrumRow
                key={row[i].sound}
                label={i}
                drumSeqArray={drumSeqArray}
                setDrumSeqArray={setDrumSeqArray}
              />
            );
          })}
        <div className="flex gap-2 justify-end">
          <button className={"" + (isPlaying && "font-bold")} onClick={playSeq}>
            Play
          </button>
          <button onClick={stopSeq}>Stop</button>
          <button onClick={clearSeq}>Clear</button>
        </div>
      </div>
    </>
  );
}
