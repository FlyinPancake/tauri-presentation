import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DemoCard } from "@/components/demo-card";

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
      <div className="flex gap-2">
        <Input
          type="number"
          value={numA}
          onChange={(e) => setNumA(Number(e.currentTarget.value))}
          placeholder="First number"
          className="flex-1"
        />
        <Input
          type="number"
          value={numB}
          onChange={(e) => setNumB(Number(e.currentTarget.value))}
          placeholder="Second number"
          className="flex-1"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => calculate("add")} variant="outline">
          Add (+)
        </Button>
        <Button onClick={() => calculate("subtract")} variant="outline">
          Subtract (−)
        </Button>
        <Button onClick={() => calculate("multiply")} variant="outline">
          Multiply (×)
        </Button>
        <Button onClick={() => calculate("divide")} variant="outline">
          Divide (÷)
        </Button>
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
    </DemoCard>
  );
}
