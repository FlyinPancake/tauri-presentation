import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DemoCard } from "@/components/demo-card";

interface ProgressUpdate {
  current: number;
  total: number;
  message: string;
}

export function EventsDemo() {
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
  const [isProgressRunning, setIsProgressRunning] = useState(false);

  async function startProgressTask() {
    setProgressUpdates([]);
    setIsProgressRunning(true);
    try {
      await invoke("start_progress_task");
    } catch (error) {
      console.error("Failed to start progress task:", error);
      setIsProgressRunning(false);
    }
  }

  // Set up event listeners
  useEffect(() => {
    const unlistenProgress = listen<ProgressUpdate>(
      "progress-update",
      (event) => {
        setProgressUpdates((prev) => [...prev, event.payload]);
      },
    );

    const unlistenComplete = listen<string>("progress-complete", (event) => {
      setIsProgressRunning(false);
      console.log("Progress complete:", event.payload);
    });

    // Cleanup listeners on unmount
    return () => {
      unlistenProgress.then((fn) => fn());
      unlistenComplete.then((fn) => fn());
    };
  }, []);

  return (
    <DemoCard
      number={5}
      title="Event Listeners (Rust → Frontend)"
      description="Real-time progress updates from Rust backend via event emission"
    >
      <Button
        onClick={startProgressTask}
        disabled={isProgressRunning}
        size="sm"
        className="w-full h-9"
        variant={isProgressRunning ? "secondary" : "default"}
      >
        {isProgressRunning ? (
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Task Running...
          </span>
        ) : (
          "Start Progress Task"
        )}
      </Button>

      {progressUpdates.length > 0 && (
        <div className="p-3 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/50 border border-indigo-200/50 dark:border-indigo-800/50 rounded-lg space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-100">
              Progress:
            </span>
            <Badge variant="outline" className="text-xs">
              {progressUpdates[progressUpdates.length - 1]?.current || 0} /{" "}
              {progressUpdates[progressUpdates.length - 1]?.total || 10}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-indigo-200 dark:bg-indigo-900/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (progressUpdates[progressUpdates.length - 1]?.current /
                    progressUpdates[progressUpdates.length - 1]?.total) *
                  100
                }%`,
              }}
            ></div>
          </div>

          {/* Recent updates (last 5) */}
          <div className="space-y-0.5 max-h-24 overflow-y-auto text-xs">
            {progressUpdates.slice(-5).map((update, idx) => (
              <div key={idx} className="text-indigo-700 dark:text-indigo-300">
                {update.message}
              </div>
            ))}
          </div>

          {!isProgressRunning && progressUpdates.length > 0 && (
            <div className="pt-2 border-t border-indigo-300/50 dark:border-indigo-700/50">
              <p className="text-xs font-medium text-green-600 dark:text-green-400">
                ✓ Task completed successfully!
              </p>
            </div>
          )}
        </div>
      )}
    </DemoCard>
  );
}
