import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { DemoCard } from "@/components/demo-card";

interface MonteCarloResult {
  pi_estimate: number;
  iterations: number;
  elapsed_ms: number;
  error: number;
}

// JavaScript implementation of Monte Carlo Pi estimation
function calculatePiJS(iterations: number): MonteCarloResult {
  const start = performance.now();

  let insideCircle = 0;

  for (let i = 0; i < iterations; i++) {
    const x = Math.random();
    const y = Math.random();

    // Check if point is inside the quarter circle
    if (x * x + y * y <= 1.0) {
      insideCircle++;
    }
  }

  const piEstimate = 4.0 * (insideCircle / iterations);
  const error = Math.abs(piEstimate - Math.PI);
  const elapsed = performance.now() - start;

  return {
    pi_estimate: piEstimate,
    iterations,
    elapsed_ms: elapsed,
    error,
  };
}

export function MonteCarloDemo() {
  const [iterations, setIterations] = useState(100_000_000);
  const [jsResult, setJsResult] = useState<MonteCarloResult | null>(null);
  const [rustResult, setRustResult] = useState<MonteCarloResult | null>(null);
  const [jsRunning, setJsRunning] = useState(false);
  const [rustRunning, setRustRunning] = useState(false);
  const [isRacing, setIsRacing] = useState(false);

  const formatNumber = (num: number) => num.toLocaleString();
  const formatTime = (ms: number) => {
    if (ms < 1) return `${ms.toFixed(3)}ms`;
    if (ms < 1000) return `${ms.toFixed(2)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };
  const formatPi = (pi: number) => pi.toFixed(6);
  const formatError = (err: number) => err.toExponential(2);

  const runJavaScript = async () => {
    setJsRunning(true);
    setJsResult(null);
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const result = calculatePiJS(iterations);
      setJsResult(result);
      setJsRunning(false);
    }, 50);
  };

  const runRust = async () => {
    setRustRunning(true);
    setRustResult(null);
    try {
      const result = await invoke<MonteCarloResult>(
        "calculate_pi_monte_carlo",
        {
          iterations,
        },
      );
      setRustResult(result);
    } finally {
      setRustRunning(false);
    }
  };

  const runRace = async () => {
    setIsRacing(true);
    setJsResult(null);
    setRustResult(null);
    setJsRunning(true);
    setRustRunning(true);

    // Start both at the same time
    const rustPromise = invoke<MonteCarloResult>("calculate_pi_monte_carlo", {
      iterations,
    }).then((result) => {
      setRustResult(result);
      setRustRunning(false);
      return result;
    });

    const jsPromise = new Promise<MonteCarloResult>((resolve) => {
      setTimeout(() => {
        const result = calculatePiJS(iterations);
        setJsResult(result);
        setJsRunning(false);
        resolve(result);
      }, 50);
    });

    await Promise.all([rustPromise, jsPromise]);
    setIsRacing(false);
  };

  const speedup =
    jsResult && rustResult && rustResult.elapsed_ms > 0
      ? jsResult.elapsed_ms / rustResult.elapsed_ms
      : null;

  const iterationOptions = [
    { value: 10_000_000, label: "10M" },
    { value: 50_000_000, label: "50M" },
    { value: 100_000_000, label: "100M" },
    { value: 500_000_000, label: "500M" },
    { value: 1_000_000_000, label: "1B" },
    { value: 5_000_000_000, label: "5B" },
  ];

  return (
    <DemoCard
      number={7}
      title="🎲 Monte Carlo Pi Estimation"
      description="Parallel processing: Single-threaded JS vs Multi-core Rust"
    >
      <div className="space-y-4">
        {/* Iteration Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Iterations:</label>
            <span className="text-sm font-mono font-bold text-purple-600 dark:text-purple-400">
              {formatNumber(iterations)}
            </span>
          </div>
          <div className="flex gap-2">
            {iterationOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => setIterations(option.value)}
                variant={iterations === option.value ? "default" : "outline"}
                size="sm"
                disabled={jsRunning || rustRunning}
                className="flex-1"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="text-xs text-purple-900 dark:text-purple-100">
            <strong>Algorithm:</strong> Generate random (x,y) points and check
            if they fall inside a quarter circle. Pi ≈ 4 × (inside / total)
          </div>
        </div>

        {/* Race Button */}
        <Button
          onClick={runRace}
          disabled={jsRunning || rustRunning}
          size="lg"
          className="w-full"
        >
          {isRacing ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Racing...
            </span>
          ) : (
            "Start Race!"
          )}
        </Button>

        {/* Individual Run Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={runJavaScript}
            disabled={jsRunning || rustRunning}
            variant="outline"
            size="sm"
          >
            {jsRunning ? "Running..." : "JS Only"}
          </Button>
          <Button
            onClick={runRust}
            disabled={jsRunning || rustRunning}
            variant="outline"
            size="sm"
          >
            {rustRunning ? "Running..." : "Rust Only"}
          </Button>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* JavaScript Result */}
          <div
            className={`p-4 rounded-lg border-2 transition-all ${
              jsRunning
                ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 animate-pulse"
                : jsResult
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30"
                  : "border-border bg-muted/30"
            }`}
          >
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              JavaScript (Single-threaded)
            </div>
            {jsRunning ? (
              <div className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300">
                <span className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Computing...
              </div>
            ) : jsResult ? (
              <>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  π ≈ {formatPi(jsResult.pi_estimate)}
                </div>
                <div className="text-sm font-mono text-orange-700 dark:text-orange-300 mb-2">
                  {formatTime(jsResult.elapsed_ms)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Error: {formatError(jsResult.error)}
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Ready</div>
            )}
          </div>

          {/* Rust Result */}
          <div
            className={`p-4 rounded-lg border-2 transition-all ${
              rustRunning
                ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30 animate-pulse"
                : rustResult
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                  : "border-border bg-muted/30"
            }`}
          >
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              Rust (Multi-core with Rayon)
            </div>
            {rustRunning ? (
              <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300">
                <span className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Computing...
              </div>
            ) : rustResult ? (
              <>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  π ≈ {formatPi(rustResult.pi_estimate)}
                </div>
                <div className="text-sm font-mono text-emerald-700 dark:text-emerald-300 mb-2">
                  {formatTime(rustResult.elapsed_ms)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Error: {formatError(rustResult.error)}
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Ready</div>
            )}
          </div>
        </div>

        {/* Speedup Banner */}
        {speedup && (
          <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-center animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="text-white font-bold text-lg">
              🚀 Rust is {speedup.toFixed(1)}x faster!
            </div>
            <div className="text-white/90 text-sm mt-1">
              {jsResult && rustResult && (
                <>
                  {formatTime(jsResult.elapsed_ms)} vs{" "}
                  {formatTime(rustResult.elapsed_ms)}
                </>
              )}
            </div>
            <div className="text-white/80 text-xs mt-1">
              Using all {navigator.hardwareConcurrency || "available"} CPU cores
            </div>
          </div>
        )}

        {/* Actual Pi Reference */}
        {/*<div className="text-center text-xs text-muted-foreground">
          Actual π = {Math.PI.toFixed(6)}
        </div>*/}
      </div>
    </DemoCard>
  );
}
