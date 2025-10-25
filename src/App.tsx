import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      {/* Sticky Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ModeToggle />
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Tauri Demo
          </h1>
        </div>

        {/* Demo Components */}
        <GreetDemo />
        <SystemInfoDemo />
        <CalculatorDemo />
        <AsyncDemo />
        <EventsDemo />
      </div>
    </div>
  );
}

export default App;
