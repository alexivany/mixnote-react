"use client";

import { useCurrentVersionContext } from "@/contexts/currentversion-context";
import { EditorContent, EditorRoot } from "novel";
import { handleCommandNavigation } from "novel/extensions";

import { defaultExtensions } from "@/extensions";

const TailwindEditor = () => {
  const extensions = [...defaultExtensions];
  const { currentVersion, setCurrentVersion } = useCurrentVersionContext();

  // const [content, setContent] = useState(null);
  return (
    currentVersion && (
      <EditorRoot>
        <EditorContent
          extensions={extensions}
          content={currentVersion.generalNotes}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            attributes: {
              class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
            },
          }}
          // initialContent={currentVersion.generalNotes}
          // onUpdate={({ editor }) => {
          //   const json = editor.getJSON();
          //   setContent(json);
          // }}
        />
      </EditorRoot>
    )
  );
};
export default TailwindEditor;
