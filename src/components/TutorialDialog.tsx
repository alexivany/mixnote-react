import { Song } from "@/types";
import SidebarNewSongModal from "./Sidebar/SidebarNewSongModal";
import { useState } from "react";

interface TutorialDialogProps {
  setSongs: React.Dispatch<React.SetStateAction<Song[] | undefined>>;
}

export default function TutorialDialog({ setSongs }: TutorialDialogProps) {
  const [showSongModal, setShowSongModal] = useState<boolean>(false);

  function handleSongModal() {
    setShowSongModal((prevState) => !prevState);
  }

  return (
    <>
      <div
        className="relative z-10 "
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-zinc-900 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        {showSongModal && (
          <SidebarNewSongModal
            setSongs={setSongs}
            handleSongModal={handleSongModal}
          />
        )}
        {!showSongModal && (
          <div className="fixed inset-0 z-10 w-screen  overflow-y-auto">
            <div className="flex min-h-full items-end border-neutral-600 rounded-lg justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden border-2 border-neutral-600 rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-neutral-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="text-center  sm:mt-0 sm:text-left">
                      <h3
                        className="text-lg text-center pb-2 font-semibold leading-6 text-gray-100"
                        id="modal-title"
                      >
                        Welcome to MixNote!
                      </h3>
                      <div className="mt-2 flex flex-col gap-2">
                        <div className="video-responsive">
                          <iframe
                            src="https://www.youtube.com/embed/AKB5SEuHcoU?si=SB5pei7-FCi9Xqyr"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          />
                        </div>
                        <p className="text-sm mt-2 text-center text-gray-300">
                          Watch the video above for a quick tutorial, or jump
                          right in and create a new song!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-neutral-700 px-4 py-3 flex justify-center sm:flex-row-reverse sm:px-6">
                  <button
                    onClick={handleSongModal}
                    className={`hover:scale-110 transition border-2 rounded-2xl bg-neutral-500 text-gray-100 border-2 px-4 py-2 font-semibold text-sm lg:text-base border-neutral-500 cursor-pointer border-neutral-700 hover:bg-neutral-600 hover:border-neutral-600 `}
                  >
                    Create New Song
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
