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
      }
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
        className="w-full"
        variant={isProgressRunning ? "secondary" : "default"}
      >
        {isProgressRunning ? "Task Running..." : "Start Progress Task"}
      </Button>

      {progressUpdates.length > 0 && (
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Progress Updates:</span>
            <Badge variant="outline">
              {progressUpdates[progressUpdates.length - 1]?.current || 0} /{" "}
              {progressUpdates[progressUpdates.length - 1]?.total || 10}
            </Badge>
          </div>

          {/* Progress Bar */}
          {progressUpdates.length > 0 && (
            <div className="w-full bg-indigo-200 dark:bg-indigo-900 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (progressUpdates[progressUpdates.length - 1]?.current /
                      progressUpdates[progressUpdates.length - 1]?.total) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          )}

          {/* Recent updates (last 5) */}
          <div className="space-y-1 max-h-32 overflow-y-auto text-xs">
            {progressUpdates.slice(-5).map((update, idx) => (
              <div key={idx} className="text-muted-foreground">
                {update.message}
              </div>
            ))}
          </div>

          {!isProgressRunning && progressUpdates.length > 0 && (
            <div className="pt-2 border-t border-indigo-300 dark:border-indigo-700">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                ✓ Task completed successfully!
              </p>
            </div>
          )}
        </div>
      )}
    </DemoCard>
  );
}
