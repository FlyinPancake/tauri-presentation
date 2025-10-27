import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { DemoCard } from "@/components/demo-card";

interface PrimeResult {
  count: number;
  elapsed_ms: number;
  limit: number;
}

// JavaScript implementation of Sieve of Eratosthenes
function calculatePrimesJS(limit: number): PrimeResult {
  const start = performance.now();

  if (limit < 2) {
    return {
      count: 0,
      elapsed_ms: performance.now() - start,
      limit,
    };
  }

  const isPrime = new Array(limit + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  const sqrtLimit = Math.floor(Math.sqrt(limit));
  for (let i = 2; i <= sqrtLimit; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= limit; j += i) {
        isPrime[j] = false;
      }
    }
  }

  const count = isPrime.filter((x) => x).length;
  const elapsed = performance.now() - start;

  return {
    count,
    elapsed_ms: elapsed,
    limit,
  };
}

export function PrimeSieveDemo() {
  const [limit, setLimit] = useState(10_000_000);
  const [jsResult, setJsResult] = useState<PrimeResult | null>(null);
  const [rustResult, setRustResult] = useState<PrimeResult | null>(null);
  const [jsRunning, setJsRunning] = useState(false);
  const [rustRunning, setRustRunning] = useState(false);
  const [isRacing, setIsRacing] = useState(false);

  const formatNumber = (num: number) => num.toLocaleString();
  const formatTime = (ms: number) => {
    if (ms < 1) return `${ms.toFixed(3)}ms`;
    if (ms < 1000) return `${ms.toFixed(2)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const runJavaScript = async () => {
    setJsRunning(true);
    setJsResult(null);
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const result = calculatePrimesJS(limit);
      setJsResult(result);
      setJsRunning(false);
    }, 50);
  };

  const runRust = async () => {
    setRustRunning(true);
    setRustResult(null);
    try {
      const result = await invoke<PrimeResult>("calculate_primes_rust", {
        limit,
      });
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
    const rustPromise = invoke<PrimeResult>("calculate_primes_rust", {
      limit,
    }).then((result) => {
      setRustResult(result);
      setRustRunning(false);
      return result;
    });

    const jsPromise = new Promise<PrimeResult>((resolve) => {
      setTimeout(() => {
        const result = calculatePrimesJS(limit);
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

  const limitOptions = [
    { value: 1_000_000, label: "1M" },
    { value: 5_000_000, label: "5M" },
    { value: 10_000_000, label: "10M" },
    { value: 20_000_000, label: "20M" },
  ];

  return (
    <DemoCard
      number={6}
      title="Prime Sieve Drag Race"
      description="Sieve of Eratosthenes: JavaScript vs Rust performance comparison"
    >
      <div className="space-y-4">
        {/* Limit Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Calculate primes up to:
            </label>
            <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">
              {formatNumber(limit)}
            </span>
          </div>
          <div className="flex gap-2">
            {limitOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => setLimit(option.value)}
                variant={limit === option.value ? "default" : "outline"}
                size="sm"
                disabled={jsRunning || rustRunning}
                className="flex-1"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Race Button */}
        <Button
          onClick={runRace}
          disabled={jsRunning || rustRunning}
          size="lg"
          className="w-full h-12"
        >
          {isRacing ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Racing...
            </span>
          ) : (
            "🏁 Start Race!"
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
              JavaScript
            </div>
            {jsRunning ? (
              <div className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300">
                <span className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Computing...
              </div>
            ) : jsResult ? (
              <>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  {formatTime(jsResult.elapsed_ms)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatNumber(jsResult.count)} primes
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
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 animate-pulse"
                : rustResult
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                  : "border-border bg-muted/30"
            }`}
          >
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              Rust
            </div>
            {rustRunning ? (
              <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                <span className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Computing...
              </div>
            ) : rustResult ? (
              <>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  {formatTime(rustResult.elapsed_ms)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatNumber(rustResult.count)} primes
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Ready</div>
            )}
          </div>
        </div>

        {/* Speedup Banner */}
        {speedup && (
          <div className="p-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg text-center animate-in fade-in slide-in-from-top-2 duration-500">
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
          </div>
        )}
      </div>
    </DemoCard>
  );
}
