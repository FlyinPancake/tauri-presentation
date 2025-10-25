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
      <Button onClick={fetchSystemInfo} variant="outline" className="w-full">
        Fetch System Info
      </Button>
      {systemInfo && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="font-semibold">OS:</span>
            <span>{systemInfo.os}</span>
            <span className="font-semibold">Architecture:</span>
            <span>{systemInfo.arch}</span>
            <span className="font-semibold">Hostname:</span>
            <span>{systemInfo.hostname}</span>
            <span className="font-semibold">Timestamp:</span>
            <span>
              {new Date(systemInfo.timestamp * 1000).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </DemoCard>
  );
}
