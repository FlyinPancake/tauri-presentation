import { ModeToggle } from "@/components/mode-toggle";
import {
  GreetDemo,
  SystemInfoDemo,
  CalculatorDemo,
  AsyncDemo,
  EventsDemo,
} from "@/components/demos";

function App() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-emerald-950/30">
      {/* Header Bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-600 shadow-lg" />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Tauri Demo
            </h1>
            <p className="text-xs text-muted-foreground">
              Frontend ⟷ Backend Communication
            </p>
          </div>
        </div>
        <ModeToggle />
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <GreetDemo />
          <SystemInfoDemo />
          <CalculatorDemo />
          <AsyncDemo />
          <EventsDemo />
        </div>
      </main>
    </div>
  );
}

export default App;
