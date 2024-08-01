import * as Tone from "tone";

import { useEffect, useRef, useState } from "react";

import { useCurrentVersionContext } from "@/contexts/currentversion-context";

import DrumRow from "./DrumRow";

import { DEFAULT_DRUM_ARRAY } from "./drummachine-utils";

import Kick from "../../assets/audio/Kick.wav";
import Snare from "../../assets/audio/SD.wav";
import HiHat from "../../assets/audio/CH.wav";
import Crash from "../../assets/audio/Crash.wav";

import { Version, DrumSeq, Song } from "@/types";
import { useCurrentSongContext } from "@/contexts/currentsong-context";
import { useThemeContext } from "@/contexts/theme-context";

export default function DrumMachine({ instrumentToTab }) {
  const { currentTheme } = useThemeContext();
  const { currentVersion, setCurrentVersion } = useCurrentVersionContext();
  const { currentSong, setCurrentSong } = useCurrentSongContext();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [drumSeqArray, setDrumSeqArray] = useState<DrumSeq[][]>();

  const seqRef = useRef<Tone.Sequence | null>(null);
  const drumMachineRef = useRef<Tone.Sampler | null>(null);
  const indicatorRefs = useRef<HTMLInputElement[]>([]);

  const indicators = Array.from({ length: 16 }, (_, i) => ({
    index: i,
    isActive: false,
  }));
  const transport = Tone.getTransport();
  const beat = useRef(0);

  const handleBpmSlider = (e) => {
    setCurrentSong((prevSongData) => {
      return {
        ...prevSongData,
        bpm: e.target.value,
      } as Song;
    });
  };

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
            const step = row[beat.current];
            if (step.isActive) {
              drumMachineRef.current?.triggerAttackRelease(
                step.note,
                "8n",
                time
              );
            }
            indicatorRefs.current[beat.current].checked = true;
          });
        }

        beat.current = (beat.current + 1) % 16;
      },
      [...Array(16).keys()],
      "16n"
    );

    seqRef.current.start(0);

    return () => {
      seqRef.current?.dispose();
      drumMachineRef.current?.dispose();
      beat.current = 0;
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
      <div
        className={
          "flex flex-col gap-2 w-full h-full overflow-auto border rounded-lg p-2 py-4 text-sm " +
          (currentTheme === "Light"
            ? "border-gray-300 "
            : " border-neutral-600")
        }
      >
        <div className="grid grid-cols-16 gap-1 justify-items-center items-center">
          <span className="col-span-1 font-semibold"></span>
          {indicators &&
            indicators.map((_, i) => {
              return (
                <label className="flex " key={"indicator-" + i}>
                  <input
                    name="seq-indicators"
                    type="radio"
                    // disabled

                    className="appearance-none peer"
                    ref={(elm) => {
                      if (!elm) return;
                      indicatorRefs.current[i] = elm;
                    }}
                  ></input>
                  <div
                    className={` w-4 h-4 rounded-2xl ${currentVersion?.theme?.bgColor} border-4 ${currentVersion?.theme?.borderColor} peer-checked:bg-white`}
                  ></div>
                </label>
              );
            })}
        </div>
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
        <div className="flex gap-2 items-center justify-end">
          <div className="flex gap-2">
            <label htmlFor="bpm-slider" className="font-semibold">
              BPM:
            </label>
            <input
              type="range"
              name="bpm-slider"
              id="bpm-slider"
              min="20"
              max="200"
              value={currentSong?.bpm as number}
              onChange={(e) => handleBpmSlider(e)}
            ></input>
          </div>
          <div className="flex p-2 gap-2">
            <button
              className={
                `text-sm lg:text-md rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} px-4 py-2 cursor-pointer ` +
                (isPlaying ? "font-bold" : "font-semibold")
              }
              onClick={playSeq}
            >
              Play
            </button>
            <button
              onClick={stopSeq}
              className={` text-sm lg:text-md rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} px-4 py-2 font-semibold cursor-pointer`}
            >
              Stop
            </button>
            <button
              onClick={clearSeq}
              className={`text-sm lg:text-md rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} px-4 py-2 font-semibold cursor-pointer`}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
