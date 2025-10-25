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
        className="w-full"
        variant={isLoading ? "secondary" : "default"}
      >
        {isLoading ? "Processing..." : "Run Async Task"}
      </Button>
      {asyncResult && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm font-medium">{asyncResult}</p>
        </div>
      )}
    </DemoCard>
  );
}
