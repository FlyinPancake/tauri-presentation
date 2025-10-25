import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";
import { ButtonGroup } from "./components/ui/button-group";
import { Plus, Minus, X, Divide } from "lucide-react";

interface SystemInfo {
  os: string;
  arch: string;
  hostname: string;
  timestamp: number;
}

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [calcResult, setCalcResult] = useState<string>("");
  const [asyncResult, setAsyncResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [numA, setNumA] = useState<number>(10);
  const [numB, setNumB] = useState<number>(5);

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  async function fetchSystemInfo() {
    const info = await invoke<SystemInfo>("get_system_info");
    setSystemInfo(info);
  }

  async function calculate(operation: string) {
    try {
      const result = await invoke<number>("perform_calculation", {
        a: numA,
        b: numB,
        operation,
      });
      setCalcResult(`${numA} ${operation} ${numB} = ${result}`);
    } catch (error) {
      setCalcResult(`Error: ${error}`);
    }
  }

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
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      {/* Sticky Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ModeToggle />
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-linear-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Tauri Demo
          </h1>
          <p className="text-xl text-muted-foreground">
            Frontend ↔️ Backend Communication
          </p>
        </div>

        {/* Demo 1: Basic Command */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">1</Badge>
              Basic Rust Command
            </CardTitle>
            <CardDescription>
              Simple function calls from TypeScript to Rust
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Demo 2: System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">2</Badge>
              Get System Information
            </CardTitle>
            <CardDescription>
              Accessing native system APIs from Rust
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={fetchSystemInfo}
              variant="outline"
              className="w-full"
            >
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
          </CardContent>
        </Card>

        {/* Demo 3: Calculations with Error Handling */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">3</Badge>
              Calculations (Error Handling Demo)
            </CardTitle>
            <CardDescription>
              Demonstrating Result types and error handling across the boundary
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="number"
                value={numA}
                onChange={(e) => setNumA(Number(e.currentTarget.value))}
                placeholder="First number"
                className="flex-1"
              />
              <ButtonGroup>
                <Button onClick={() => calculate("add")} variant="outline">
                  <Plus />
                </Button>
                <Button onClick={() => calculate("subtract")} variant="outline">
                  <Minus />
                </Button>
                <Button onClick={() => calculate("multiply")} variant="outline">
                  <X />
                </Button>
                <Button onClick={() => calculate("divide")} variant="outline">
                  <Divide />
                </Button>
              </ButtonGroup>
              <Input
                type="number"
                value={numB}
                onChange={(e) => setNumB(Number(e.currentTarget.value))}
                placeholder="Second number"
                className="flex-1"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              💡 Try dividing by zero to see error handling!
            </p>
            {calcResult && (
              <div
                className={`p-4 border rounded-lg ${
                  calcResult.startsWith("Error")
                    ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                    : "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800"
                }`}
              >
                <p className="text-sm font-medium">{calcResult}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demo 4: Async Operations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">4</Badge>
              Async Task (2 second delay)
            </CardTitle>
            <CardDescription>
              Non-blocking asynchronous operations with Tokio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Footer */}
        <Card>
          <CardHeader>
            <CardTitle>Key Concepts Demonstrated</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  ✓
                </Badge>
                <span>Frontend-Backend communication via Tauri commands</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  ✓
                </Badge>
                <span>Synchronous and asynchronous operations</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  ✓
                </Badge>
                <span>Type-safe data passing between Rust and TypeScript</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  ✓
                </Badge>
                <span>Error handling across the boundary</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  ✓
                </Badge>
                <span>Native system access from Rust</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
