import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { DemoCard } from "@/components/demo-card";
import { Plus, Minus, X, Divide } from "lucide-react";

export function CalculatorDemo() {
  const [calcResult, setCalcResult] = useState<string>("");
  const [numA, setNumA] = useState<number>(10);
  const [numB, setNumB] = useState<number>(5);

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

  return (
    <DemoCard
      number={3}
      title="Calculations (Error Handling Demo)"
      description="Demonstrating Result types and error handling across the boundary"
    >
      <div className="flex gap-2 items-center">
        <Input
          type="number"
          value={numA}
          onChange={(e) => setNumA(Number(e.currentTarget.value))}
          placeholder="First number"
          className="flex-1 h-9"
        />
        <ButtonGroup>
          <Button
            onClick={() => calculate("add")}
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => calculate("subtract")}
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => calculate("multiply")}
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => calculate("divide")}
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0"
          >
            <Divide className="h-4 w-4" />
          </Button>
        </ButtonGroup>
        <Input
          type="number"
          value={numB}
          onChange={(e) => setNumB(Number(e.currentTarget.value))}
          placeholder="Second number"
          className="flex-1 h-9"
        />
      </div>

      <p className="text-xs text-muted-foreground italic">
        💡 Try dividing by zero to see error handling!
      </p>
      {calcResult && (
        <div
          className={`p-3 border rounded-lg animate-in fade-in slide-in-from-top-1 duration-300 ${
            calcResult.startsWith("Error")
              ? "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 border-red-200/50 dark:border-red-800/50"
              : "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200/50 dark:border-purple-800/50"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              calcResult.startsWith("Error")
                ? "text-red-900 dark:text-red-100"
                : "text-purple-900 dark:text-purple-100"
            }`}
          >
            {calcResult}
          </p>
        </div>
      )}
    </DemoCard>
  );
}
