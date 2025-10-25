import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DemoCard } from "@/components/demo-card";

interface GreetMessage {
  message?: string;
  error?: string;
}

export function GreetDemo() {
  const [greetMsg, setGreetMsg] = useState<GreetMessage>({});
  const [name, setName] = useState("");

  async function greet() {
    try {
      setGreetMsg({ message: await invoke("greet", { name }) });
    } catch (error) {
      setGreetMsg({ error: `${error}` });
    }
  }

  return (
    <DemoCard
      number={1}
      title="Basic Rust Command"
      description="Simple function calls from TypeScript to Rust"
    >
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <Input
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
          className="flex-1 h-9"
        />
        <Button type="submit" size="sm">
          Greet
        </Button>
      </form>
      {greetMsg.message && (
        <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border border-blue-200/50 dark:border-blue-800/50 rounded-lg animate-in fade-in slide-in-from-top-1 duration-300">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {greetMsg.message}
          </p>
        </div>
      )}
      {greetMsg?.error && (
        <div className="p-3 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 border border-red-200/50 dark:border-red-800/50 rounded-lg animate-in fade-in slide-in-from-top-1 duration-300">
          <p className="text-sm font-medium text-red-900 dark:text-red-100">
            {greetMsg.error}
          </p>
        </div>
      )}
    </DemoCard>
  );
}
