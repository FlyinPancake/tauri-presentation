import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DemoCard } from "@/components/demo-card";

export function GreetDemo() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
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
          className="flex-1"
        />
        <Button type="submit">Greet</Button>
      </form>
      {greetMsg && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm font-medium">{greetMsg}</p>
        </div>
      )}
    </DemoCard>
  );
}
