import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { DemoCard } from "@/components/demo-card";

interface SystemInfo {
  os: string;
  arch: string;
  hostname: string;
  timestamp: number;
}

export function SystemInfoDemo() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);

  async function fetchSystemInfo() {
    const info = await invoke<SystemInfo>("get_system_info");
    setSystemInfo(info);
  }

  return (
    <DemoCard
      number={2}
      title="Get System Information"
      description="Accessing native system APIs from Rust"
    >
      <Button
        onClick={fetchSystemInfo}
        variant="outline"
        size="sm"
        className="w-full h-9"
      >
        Fetch System Info
      </Button>
      {systemInfo && (
        <div className="p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50 border border-emerald-200/50 dark:border-emerald-800/50 rounded-lg animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
            <span className="font-semibold text-emerald-900 dark:text-emerald-100">
              OS:
            </span>
            <span className="text-emerald-800 dark:text-emerald-200">
              {systemInfo.os}
            </span>
            <span className="font-semibold text-emerald-900 dark:text-emerald-100">
              Architecture:
            </span>
            <span className="text-emerald-800 dark:text-emerald-200">
              {systemInfo.arch}
            </span>
            <span className="font-semibold text-emerald-900 dark:text-emerald-100">
              Hostname:
            </span>
            <span className="text-emerald-800 dark:text-emerald-200">
              {systemInfo.hostname}
            </span>
            <span className="font-semibold text-emerald-900 dark:text-emerald-100">
              Timestamp:
            </span>
            <span className="text-emerald-800 dark:text-emerald-200">
              {new Date(systemInfo.timestamp * 1000).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </DemoCard>
  );
}
