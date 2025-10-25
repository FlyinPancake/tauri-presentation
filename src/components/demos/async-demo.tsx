import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { DemoCard } from "@/components/demo-card";

export function AsyncDemo() {
  const [asyncResult, setAsyncResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  async function runAsyncTask() {
    setIsLoading(true);
    setAsyncResult("Processing...");
    try {
      const result = await invoke<string>("async_task", { duration: 2 });
      setAsyncResult(result);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DemoCard
      number={4}
      title="Async Task (2 second delay)"
      description="Non-blocking asynchronous operations with Tokio"
    >
      <Button
        onClick={runAsyncTask}
        disabled={isLoading}
        size="sm"
        className="w-full h-9"
        variant={isLoading ? "secondary" : "default"}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          "Run Async Task"
        )}
      </Button>
      {asyncResult && !isLoading && (
        <div className="p-3 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50 border border-amber-200/50 dark:border-amber-800/50 rounded-lg animate-in fade-in slide-in-from-top-1 duration-300">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
            {asyncResult}
          </p>
        </div>
      )}
    </DemoCard>
  );
}
