import { useState, useRef, useEffect } from "react";

import { useOnClickOutside } from "usehooks-ts";

import { useApiContext } from "../../contexts/api-context";
import { useThemeContext } from "@/contexts/theme-context";
import SidebarNewSongModal from "./SidebarNewSongModal";

import { AnimatePresence, motion } from "framer-motion";

interface SidebarSettings {
  setSongs: (newSongArray) => void;
}

export default function SidebarSettings({ setSongs }: SidebarSettings) {
  const { currentTheme, setCurrentTheme } = useThemeContext();

  const [showSongModal, setShowSongModal] = useState<boolean>(false);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);

  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  const { apiKey, setApiKey } = useApiContext();

  const [themeCheckbox, setThemeCheckBox] = useState<boolean>();

  const settingsModalRef = useRef(null);

  function handleSongModal() {
    setShowSongModal((prevState) => !prevState);
  }

  function handleAboutModal() {
    setShowAboutModal((prevState) => !prevState);
  }

  function handleSettingsModal() {
    setShowSettingsModal((prevState) => !prevState);
  }

  function handleThemeCheckbox() {
    setThemeCheckBox((prevState) => !prevState);
    if (themeCheckbox) {
      setCurrentTheme("Light");
    } else {
      setCurrentTheme("Dark");
    }
  }

  useEffect(() => {
    if (currentTheme === "Dark") {
      currentTheme === "Dark" && setThemeCheckBox(true);
    } else {
      setThemeCheckBox(false);
    }
  }, [currentTheme]);

  useOnClickOutside(settingsModalRef, handleSettingsModal);
  return (
    <div
      className={
        "lg:absolute lg:inset-x-4  w-full lg:w-auto text-lg lg:bottom-0 pt-4 border-t border-b pb-4  lg:mb-4 flex lg:flex-col justify-between gap-4 " +
        (currentTheme === "Light" ? "border-gray-300" : " border-neutral-600")
      }
    >
      <button
        onClick={handleSongModal}
        className={
          "flex gap-4 whitespace-nowrap text-sm md:text-lg items-center hover:bg-gray-50 hover:font-semibold hover:scale-110 transition-transform  hover:rounded-2xl hover:outline hover:outline-4 hover:outline-gray-50 group " +
          (currentTheme === "Dark" && "hover:text-black")
        }
      >
        <img
          src="/SVG/plus.svg"
          className={
            "w-6 " +
            (currentTheme === "Dark" && "invert grayscale group-hover:invert-0")
          }
          alt=""
        />
        New Song
      </button>
      <button
        onClick={handleSettingsModal}
        className={
          "flex gap-4 text-sm md:text-lg items-center hover:bg-gray-50 hover:font-semibold hover:scale-110 transition-transform hover:rounded-2xl hover:outline hover:outline-4 hover:outline-gray-50 group " +
          (currentTheme === "Dark" && "hover:text-black")
        }
      >
        <img
          src="/SVG/settings.svg"
          className={
            "w-6 " +
            (currentTheme === "Dark" && "grayscale invert group-hover:invert-0")
          }
          alt=""
        />
        Preferences
      </button>
      <button
        onClick={handleAboutModal}
        className={
          "flex gap-4 text-sm md:text-lg items-center hover:bg-gray-50 hover:font-semibold hover:rounded-2xl hover:scale-110 transition-transform hover:outline hover:outline-4 hover:outline-gray-50 group " +
          (currentTheme === "Dark" && "hover:text-black")
        }
      >
        <img
          src="/SVG/info.svg"
          className={
            "w-6 " +
            (currentTheme === "Dark" && "grayscale invert group-hover:invert-0")
          }
          alt=""
        />
        About
      </button>
      <AnimatePresence>
        {showSongModal && (
          <SidebarNewSongModal
            handleSongModal={handleSongModal}
            setSongs={setSongs}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettingsModal && (
          <>
            <motion.div
              onClick={handleSettingsModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              key="settings-backdrop"
              className="fixed top-0 left-0 z-10 h-full w-full bg-neutral-900"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -400 }}
              // ref={settingsModalRef}
              className={
                "fixed top-1/4 left-0 gap-4 font-semibold m-auto right-0 lg:w-2/5 w-4/5  flex flex-col justify-between border rounded-xl z-10 py-6 px-6 " +
                (currentTheme === "Light"
                  ? "bg-white text-black border-gray-300"
                  : "bg-neutral-800 text-white border-neutral-600")
              }
            >
              <span className="text-xl">User OpenAI API Key</span>
              <input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="text"
                className={
                  "max-w-full font-normal mb-2 border border-gray-300 px-2 rounded-lg " +
                  (currentTheme === "Light" ? "bg-white" : "bg-neutral-800")
                }
              ></input>
              <label className="inline-flex gap-2 items-center cursor-pointer">
                <img
                  src="/SVG/sun.svg"
                  className={
                    "w-6 " + (currentTheme === "Dark" && "grayscale invert")
                  }
                />

                <input
                  type="checkbox"
                  checked={themeCheckbox}
                  className="sr-only peer"
                  onChange={handleThemeCheckbox}
                ></input>
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <img
                  src="/SVG/moon.svg"
                  className={
                    "w-6 " + (currentTheme === "Dark" && "grayscale invert ")
                  }
                />
              </label>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={handleSettingsModal}
                  className={
                    "border-2 py-2 px-4 rounded-2xl cursor-pointer hover:scale-110 transition-transform " +
                    (currentTheme === "Light"
                      ? "bg-gray-100 border-gray-100 hover:bg-gray-200 hover:bg-gray-200"
                      : "bg-neutral-700 border-neutral-700 hover:bg-neutral-500 hover:border-neutral-500")
                  }
                >
                  OK
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAboutModal && (
          <>
            <motion.div
              onClick={handleAboutModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              key="settings-backdrop"
              className="fixed top-0 left-0 z-10 h-full w-full bg-neutral-900"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -400 }}
              // ref={settingsModalRef}
              className={
                "fixed top-1/4 left-0 gap-4 font-semibold m-auto right-0 lg:w-2/5 w-4/5  flex flex-col justify-between border rounded-xl z-10 py-6 px-6 " +
                (currentTheme === "Light"
                  ? "bg-white text-black border-gray-300"
                  : "bg-neutral-800 text-white border-neutral-600")
              }
            >
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
                <p className="text-sm  align-center mt-2 text-center">
                  MixNote is a songwriting journal made by musicians, for
                  musicians, to help with every step of your creative process.
                </p>
                <p className="text-sm  align-center mt-2 text-center">
                  Contact: ivany.world@gmail.com
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleAboutModal}
                  className={
                    "border-2 py-2 px-4 rounded-2xl cursor-pointer hover:scale-110 transition-transform " +
                    (currentTheme === "Light"
                      ? "bg-gray-100 border-gray-100 hover:bg-gray-200 hover:bg-gray-200"
                      : "bg-neutral-700 border-neutral-700 hover:bg-neutral-500 hover:border-neutral-500")
                  }
                >
                  OK
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
