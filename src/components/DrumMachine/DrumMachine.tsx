import * as Tone from "tone";

import { useEffect, useState } from "react";

import DrumRow from "./DrumRow";

import Kick from "../../assets/audio/Kick.wav";
import Snare from "../../assets/audio/SD.wav";
import HiHat from "../../assets/audio/CH.wav";
import Crash from "../../assets/audio/Crash.wav";

export default function DrumMachine({ currentVersion }) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  function handlePlayButton() {
    setIsPlaying(true);
  }

  function handleStopButton() {
    setIsPlaying(false);
  }

  const drumMachine = new Tone.Sampler({
    urls: {
      C1: Kick,
      C2: Snare,
      C3: HiHat,
      C4: Crash,
    },
    onload: () => console.log("loaded"),
  }).toDestination();

  const stepSeq = new Tone.Sequence(
    (time, note) => {
      drumMachine.triggerAttackRelease(note, 0.1, time);
    },
    ["C1", "C1", "C3", "C2", "C3", "C4", "C1", "C3"]
  ).start(0);

  // Usememo / useCallback

  async function playSeq() {
    await Tone.start();
    console.log("PLAYING");
    Tone.getTransport().start();
  }

  function stopSeq() {
    console.log("STOPPING");
    Tone.getTransport().stop();
  }

  // useEffect(() => {
  //   async function handleSeq() {
  //     await Tone.start();
  //     if (isPlaying) {
  //       console.log("PLAYING");
  //       stepSeq.start(0);
  //       Tone.getTransport().start();
  //     } else {
  //       console.log("STOPPING");
  //       stepSeq.stop(0);
  //       Tone.getTransport().stop();
  //     }
  //   }

  //   handleSeq();
  // }, [isPlaying]);

  return (
    <>
      <div className="flex flex-col gap-1 w-full border border-gray-300 rounded-lg p-2 text-sm">
        <DrumRow label={"Crash"} currentVersion={currentVersion} />
        <DrumRow label={"Hi-Hat"} currentVersion={currentVersion} />
        <DrumRow label={"Snare"} currentVersion={currentVersion} />
        <DrumRow label={"Kick"} currentVersion={currentVersion} />
      </div>
      <div className="flex gap-2 justify-end">
        <span className={"" + (isPlaying && "font-bold")} onClick={playSeq}>
          Play
        </span>
        <span onClick={stopSeq}>Stop</span>
      </div>
    </>
  );
}
