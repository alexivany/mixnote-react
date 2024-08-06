import * as Tone from "tone";

import { ReactP5Wrapper } from "@p5-wrapper/react";

import { useCallback, useEffect, useRef, useState } from "react";

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
  const [waveformWidth, setWaveformWidth] = useState<number>(256);

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
    transport.bpm.value = e.target.value;
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

  const colorSwitch = (themeColor) => {
    switch (themeColor) {
      case "bg-red-500":
        return "#ef4444";
      case "bg-orange-500":
        return "#f97316";
      case "bg-yellow-400":
        return "#facc15";
      case "bg-green-500":
        return "#22c55e";
      case "bg-teal-500":
        return "#14b8a6";
      case "bg-cyan-500":
        return "#06b6d4";
      case "bg-blue-500":
        return "#3b82f6";
      case "bg-purple-500":
        return "#a855f7";
      case "bg-pink-500":
        return "#ec4899";
      case "bg-gray-100":
        return null;
    }
  };

  function sketch(p5) {
    let analyser;
    let fillColor;
    p5.setup = () => {
      const audSrc = Tone.getDestination();
      analyser = new Tone.Analyser({
        type: "waveform",
        size: 1024,
        smoothing: 1,
      });
      audSrc.connect(analyser);
      p5.createCanvas(waveformWidth, 64);
      fillColor = colorSwitch(currentVersion?.theme?.bgColor);
    };

    p5.draw = () => {
      currentTheme === "Light" ? p5.background(255) : p5.background(38);
      if (fillColor) {
        p5.fill(fillColor);
      } else {
        currentTheme === "Light"
          ? p5.fill(p5.color(38))
          : p5.fill(p5.color(255));
      }

      currentTheme === "Light" ? p5.stroke(255) : p5.stroke(38);
      analyser.getValue().forEach(function (v, idx) {
        p5.circle(idx / 2, (p5.height * (-1 * v + 1)) / 2, 5);
      });
    };
  }

  const handleDrumMachineResize = useCallback(
    (node: HTMLDivElement) => {
      const resizeObserver = new ResizeObserver(() => {
        if (node.clientWidth <= 782 && node.clientHeight <= 220) {
          setWaveformWidth(128);
        } else if (node.clientWidth >= 1024) {
          setWaveformWidth(500);
        } else {
          setWaveformWidth(256);
        }
      });
      if (node) {
        resizeObserver.observe(node);
      }
    },
    [setWaveformWidth]
  );

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
      if (currentVersion?.[instrumentToTab].drumSeq !== drumSeqArray) {
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

  // useEffect(() => {
  //   // if (drumSeqArray !== currentVersion?.[instrumentToTab].drumSeq) {
  //   //   setDrumSeqArray(currentVersion?.[instrumentToTab].drumSeq);
  //   // }
  // }, [currentSong]);

  return (
    <>
      <div
        ref={handleDrumMachineResize}
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
                    className={
                      ` w-4 h-4 rounded-2xl border-4 peer-checked:bg-white ` +
                      (currentVersion?.theme?.bgColor === "bg-gray-100"
                        ? "bg-gray-300 border-gray-300 "
                        : `${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.borderColor}`)
                    }
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
        <div className="flex gap-2 items-center justify-between">
          <ReactP5Wrapper sketch={sketch} />
          <div className="flex justify-end items-center">
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
                  ` text-sm lg:text-md rounded-2xl border-2 ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} ${currentVersion?.theme?.hoverColor}  px-3 py-2 font-semibold cursor-pointer ` +
                  (currentTheme === "Dark"
                    ? " hover:bg-neutral-800 "
                    : " hover:bg-white ") +
                  (currentVersion?.theme?.textColor === "text-black" &&
                    currentTheme === "Dark" &&
                    " hover:text-white ")
                }
                onClick={playSeq}
              >
                Play
              </button>
              <button
                onClick={stopSeq}
                className={
                  ` text-sm lg:text-md rounded-2xl border-2 ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} ${currentVersion?.theme?.hoverColor}  px-3 py-2 font-semibold cursor-pointer ` +
                  (currentTheme === "Dark"
                    ? " hover:bg-neutral-800 "
                    : " hover:bg-white ") +
                  (currentVersion?.theme?.textColor === "text-black" &&
                    currentTheme === "Dark" &&
                    " hover:text-white ")
                }
              >
                Stop
              </button>
              <button
                onClick={clearSeq}
                className={
                  ` text-sm lg:text-md rounded-2xl border-2 ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} ${currentVersion?.theme?.hoverColor}  px-3 py-2 font-semibold cursor-pointer ` +
                  (currentTheme === "Dark"
                    ? " hover:bg-neutral-800 "
                    : " hover:bg-white ") +
                  (currentVersion?.theme?.textColor === "text-black" &&
                    currentTheme === "Dark" &&
                    " hover:text-white ")
                }
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
