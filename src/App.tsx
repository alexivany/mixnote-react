import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import SongView from "./components/SongView";

export default function App() {
  const [songs, setSongs] = useState(
    JSON.parse(localStorage.getItem("songapp-songs")) || []
  );

  const [currentSong, setCurrentSong] = useState(songs[0] || {});

  // const [currentSongId, setCurrentSongId] = useState(
  //   (songs[0] && songs[0].id) || ""
  // );

  // function findCurrentSong() {
  //   return (
  //     songs.find((song) => {
  //       return song.id === currentSongId;
  //     }) || songs[0]
  //   );
  // }

  useEffect(() => {
    localStorage.setItem("songapp-songs", JSON.stringify(songs));
  }, [songs]);

  return (
    <>
      <Sidebar
        songs={songs}
        setCurrentSong={setCurrentSong}
        currentSong={currentSong}
      />
      <SongView currentSong={currentSong} />
    </>
  );
}
