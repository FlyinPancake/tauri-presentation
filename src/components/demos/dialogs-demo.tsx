import { DemoCard } from "../demo-card";
import { Button } from "@/components/ui/button";
import { open, confirm } from "@tauri-apps/plugin-dialog";
import { useState } from "react";

// You can add the dialog plugin with
// // tauri plugin add dialog

export function DialogsDemo() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const selectFile = async () => {
    const selected = await open({
      multiple: false,
      title: "Select a file",
      filters: [
        {
          name: "Text Files",
          extensions: ["txt", "md"],
        },
        {
          name: "All Files",
          extensions: ["*"],
        },
      ],
    });
    setSelectedFile(typeof selected === "string" ? selected : null);
  };

  const [confirmResult, setConfirmResult] = useState<boolean | null>(null);

  const showConfirmDialog = async () => {
    const confirmed = await confirm(
      "This action cannot be reverted. Are you sure?",
      { title: "Tauri", kind: "warning" },
    );
    setConfirmResult(confirmed);
  };

  return (
    <DemoCard
      number={8}
      title="Dialogs"
      description="Displaying native file and message dialogs"
    >
      <Button size="sm" className="w-full h-9" onClick={selectFile}>
        Select File
      </Button>
      {selectedFile && (
        <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border border-purple-200/50 dark:border-purple-800/50 rounded-lg animate-in fade-in slide-in-from-top-1 duration-300">
          <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
            Selected File: {selectedFile}
          </p>
        </div>
      )}
      <Button size="sm" className="w-full h-9" onClick={showConfirmDialog}>
        Confirm Dialog
      </Button>
      {confirmResult !== null && (
        <div className="p-3 bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/50 border border-pink-200/50 dark:border-pink-800/50 rounded-lg animate-in fade-in slide-in-from-top-1 duration-300">
          <p className="text-sm font-medium text-pink-900 dark:text-pink-100">
            User selected: {confirmResult ? "OK" : "Cancel"}
          </p>
        </div>
      )}
    </DemoCard>
  );
}
