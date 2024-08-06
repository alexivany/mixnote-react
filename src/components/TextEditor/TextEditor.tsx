"use client";

import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import "@/texteditor.scss";

import MenuBar from "./MenuBar";

import { useThemeContext } from "@/contexts/theme-context";

import { useOnClickOutside } from "usehooks-ts";
import { useEffect, useRef, useState } from "react";
import { useCurrentVersionContext } from "@/contexts/currentversion-context";
import { Version } from "@/types";
import { Placeholder } from "novel/extensions";
import { useCurrentSongContext } from "@/contexts/currentsong-context";

export default function TextEditor({ objectKey, noteToLoad }) {
  const { currentTheme } = useThemeContext();

  const { currentVersion, setCurrentVersion } = useCurrentVersionContext();

  const { currentSong } = useCurrentSongContext();

  const [showMenuBar, setShowMenuBar] = useState<boolean>(false);

  const [placeholder, setPlaceholder] = useState<string>(
    "Enter your notes here…"
  );

  const editorRef = useRef<HTMLDivElement>(null);

  const getValueFromPath = (obj, path) => {
    const keys = path.split("?.").flatMap((key) => key.split("."));
    return keys.reduce((acc, key) => acc?.[key], obj);
  };

  const editor = useEditor({
    onUpdate({ editor }) {
      if (currentVersion) {
        const noteshtml = editor.getHTML();
        // The content has changed.
        if (objectKey === "generalNotes") {
          setCurrentVersion((prevVersionData) => {
            return {
              ...prevVersionData,
              [objectKey]: noteshtml,
            } as Version;
          });
        } else if (noteToLoad === "Vocals.lyrics") {
          setCurrentVersion((prevVersionData) => {
            if (prevVersionData) {
              return {
                ...prevVersionData,
                [objectKey]: {
                  ...prevVersionData[objectKey],
                  lyrics: noteshtml,
                },
              } as Version;
            }
          });
        } else {
          setCurrentVersion((prevVersionData) => {
            if (prevVersionData) {
              return {
                ...prevVersionData,
                [objectKey]: {
                  ...prevVersionData[objectKey],
                  notes: noteshtml,
                },
              } as Version;
            }
          });
        }
      }
    },
    content: getValueFromPath(currentVersion, noteToLoad),
    extensions: [
      StarterKit.configure(),
      Placeholder.configure({
        placeholder: placeholder,
      }),
      Underline,
      Highlight,
      TaskList,
      TaskItem,
      CharacterCount.configure({
        limit: 10000,
      }),
    ],
  });

  function handleMenuClickOutside() {
    setShowMenuBar(false);
  }

  useEffect(() => {
    setPlaceholder(
      noteToLoad === "Vocals.lyrics"
        ? "Enter your lyrics here…"
        : "Enter your notes here…"
    );
  }, []);

  useEffect(() => {
    if (editor?.isFocused) {
      setShowMenuBar(true);
    }
  }, [editor, editor?.isFocused]);

  useEffect(() => {
    if (editor?.getHTML() !== getValueFromPath(currentVersion, noteToLoad)) {
      editor?.commands.setContent(getValueFromPath(currentVersion, noteToLoad));
    }
  }, [currentSong]);

  useOnClickOutside(editorRef, handleMenuClickOutside);

  if (!editor) {
    return null;
  }

  return (
    <div
      ref={editorRef}
      className={
        "resize-none relative gap-2 border rounded-lg p-2 text-sm min-w-full " +
        (currentTheme === "Light"
          ? "border-gray-300 "
          : "bg-neutral-800 border-neutral-600 ") +
        (editor?.isFocused && "outline-2 outline-gray-500 ")
      }
    >
      {editor && showMenuBar && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
