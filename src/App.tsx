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
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      {/* Sticky Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ModeToggle />
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-lienar-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Tauri Demo
          </h1>
          <p className="text-xl text-muted-foreground">
            Frontend ↔️ Backend Communication
          </p>
        </div>

        {/* Demo Components */}
        <GreetDemo />
        <SystemInfoDemo />
        <CalculatorDemo />
        <AsyncDemo />
        <EventsDemo />

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
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  ✓
                </Badge>
                <span>Event-driven architecture with real-time updates</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
