# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Tauri demonstration application** designed for presenting Tauri's capabilities. It showcases frontend-backend communication between a React/TypeScript frontend and a Rust backend through Tauri's IPC bridge.

**Purpose**: Educational presentation tool to demonstrate Tauri features to colleagues.

## Development Commands

This project uses **Bun** as the package manager (not npm or yarn).

```bash
# Install dependencies
bun install

# Run development server (starts both Vite and Tauri)
bun run tauri dev

# Build production app
bun run tauri build

# Frontend-only development (Vite without Tauri)
bun run dev

# Type check
tsc
```

**Important**: The dev server runs on a fixed port (1420) as required by Tauri. If the port is unavailable, the server will fail to start.

## Adding shadcn/ui Components

This project uses shadcn/ui with Tailwind CSS v4. To add new components:

```bash
bunx --bun shadcn@latest add <component-name>
```

Note: Always use `bunx --bun` prefix (not just `bunx`) for consistency with Bun.

## Architecture

### Frontend-Backend Communication

The core architecture follows Tauri's IPC pattern:

**Frontend (TypeScript)** → `invoke()` → **Rust Backend**

```typescript
// Frontend: src/App.tsx
import { invoke } from "@tauri-apps/api/core";

// Calling Rust commands
const result = await invoke<ReturnType>("command_name", { param: value });
```

```rust
// Backend: src-tauri/src/lib.rs
#[tauri::command]
fn command_name(param: Type) -> ReturnType {
    // Implementation
}

// Register in run() function
.invoke_handler(tauri::generate_handler![command_name])
```

### Demo Command Examples

The project demonstrates four types of Tauri commands:

1. **Basic sync command**: `greet(name: &str) -> String`
2. **Complex data structures**: `get_system_info() -> SystemInfo` (uses Serde serialization)
3. **Error handling**: `perform_calculation(...) -> Result<i32, String>`
4. **Async operations**: `async_task(duration: u64) -> String` (uses Tokio)

All commands are in `src-tauri/src/lib.rs` and must be registered in the `invoke_handler!` macro.

### Type Safety

TypeScript interfaces should mirror Rust structs for type safety:

```typescript
// src/App.tsx
interface SystemInfo {
  os: string;
  arch: string;
  hostname: string;
  timestamp: number;
}
```

```rust
// src-tauri/src/lib.rs
#[derive(Debug, Serialize, Deserialize)]
pub struct SystemInfo {
    os: String,
    arch: String,
    hostname: String,
    timestamp: u64,
}
```

## Key Technical Decisions

### Styling System

- **Tailwind CSS v4** with the new `@import "tailwindcss"` syntax
- **shadcn/ui** components for consistent UI
- **Theme system**: Uses `ThemeProvider` from `src/components/theme-provider.tsx`
- **Global styles**: `src/globals.css` must be imported in `src/main.tsx` for Tailwind to work

### Path Aliases

Configured in both `tsconfig.json` and `vite.config.ts`:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`

Always use `@/components/ui/...` imports for shadcn components.

### Rust Dependencies

Key crates in `src-tauri/Cargo.toml`:
- **tauri**: Core framework (version 2)
- **serde/serde_json**: JSON serialization for IPC
- **tokio**: Async runtime (with "time" feature for delays)
- **hostname**: System information access

## Project Structure

```
src/
├── App.tsx              # Main demo UI with all 4 examples
├── main.tsx             # Entry point (imports globals.css)
├── globals.css          # Tailwind CSS v4 config
├── components/
│   ├── ui/              # shadcn components
│   ├── theme-provider.tsx
│   └── mode-toggle.tsx  # Dark/light mode toggle
src-tauri/
├── src/
│   ├── lib.rs           # All Tauri commands
│   └── main.rs          # Entry point
├── Cargo.toml           # Rust dependencies
└── tauri.conf.json      # Tauri configuration
```

## Common Modifications

### Adding a New Tauri Command

1. Define the command in `src-tauri/src/lib.rs`:
   ```rust
   #[tauri::command]
   fn my_command(param: Type) -> ReturnType {
       // implementation
   }
   ```

2. Register it in the `run()` function:
   ```rust
   .invoke_handler(tauri::generate_handler![
       greet,
       get_system_info,
       my_command  // Add here
   ])
   ```

3. Call it from TypeScript:
   ```typescript
   const result = await invoke<ReturnType>("my_command", { param: value });
   ```

### Rust Dependencies

After adding dependencies to `Cargo.toml`, Tauri will automatically rebuild. No separate `cargo build` needed when using `bun run tauri dev`.

## Presentation Notes

The demo is organized in numbered sections (1-4) using shadcn Card components. Each demonstrates a specific Tauri concept:

1. Basic command invocation
2. System API access and complex types
3. Error handling (try divide by zero)
4. Async operations with UI feedback

The UI includes a sticky theme toggle in the top-right corner for demonstrating dark/light mode support.
