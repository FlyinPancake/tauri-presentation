# Tauri Presentation Demo

A demonstration project showcasing Tauri's capabilities for building desktop applications with web technologies.

## What is Tauri?

Tauri is a framework for building desktop applications using web technologies (HTML, CSS, JavaScript) for the frontend and Rust for the backend. It provides:

- **Small bundle sizes** - Unlike Electron, Tauri uses the OS's native webview
- **Security first** - Built with security best practices by default
- **Cross-platform** - Build for Windows, macOS, and Linux from a single codebase
- **Native performance** - Rust backend provides excellent performance
- **Modern tooling** - Works with any frontend framework (React, Vue, Svelte, etc.)

## Demo Features

This demo showcases key Tauri concepts:

### 1. **Basic Rust Commands**
- Simple function calls from TypeScript to Rust
- String parameter passing and return values
- Located in: `src-tauri/src/lib.rs:5`

### 2. **System Information Retrieval**
- Accessing native system APIs from Rust
- Returning complex data structures (structs)
- Type-safe serialization/deserialization with Serde
- Located in: `src-tauri/src/lib.rs:18`

### 3. **Error Handling**
- Demonstrating Result types across the boundary
- Graceful error handling in TypeScript
- Try the divide operation with zero!
- Located in: `src-tauri/src/lib.rs:36`

### 4. **Async Operations**
- Asynchronous Rust commands with Tokio
- Non-blocking operations that don't freeze the UI
- Located in: `src-tauri/src/lib.rs:54`

## Tech Stack

**Frontend:**
- React 19
- TypeScript
- Vite
- @tauri-apps/api

**Backend:**
- Rust
- Tauri 2.0
- Tokio (async runtime)
- Serde (serialization)

## Running the Demo

### Development Mode
```bash
bun install
bun run tauri dev
```

### Production Build
```bash
bun run tauri build
```

The build output will be in `src-tauri/target/release/`.

## Key Files to Show

1. **Frontend Command Invocation**: `src/App.tsx`
   - Shows how to call Rust commands from TypeScript
   - Type-safe interfaces
   - Error handling

2. **Rust Backend Commands**: `src-tauri/src/lib.rs`
   - Tauri command definitions
   - Sync and async functions
   - Data structures

3. **Configuration**: `src-tauri/tauri.conf.json`
   - App settings, permissions, and build configuration

4. **Dependencies**: `src-tauri/Cargo.toml`
   - Rust dependencies and features

## Presentation Talking Points

### Why Tauri over Electron?

**Size Comparison:**
- Electron: ~120MB minimum (includes Chromium + Node.js)
- Tauri: ~3-15MB (uses system webview)

**Memory Usage:**
- Electron: Higher (separate browser engine)
- Tauri: Lower (shared system webview)

**Security:**
- Tauri: More secure by default with explicit permissions
- Smaller attack surface

### Architecture

```
┌─────────────────────────────────────┐
│         Frontend (Webview)          │
│    React/Vue/Svelte/Vanilla JS      │
└──────────────┬──────────────────────┘
               │ IPC Bridge
               │ (Type-safe)
┌──────────────▼──────────────────────┐
│         Rust Backend Core           │
│   • System APIs                     │
│   • File System                     │
│   • Native Features                 │
│   • Business Logic                  │
└─────────────────────────────────────┘
```

### Use Cases

Perfect for:
- Developer tools
- Desktop utilities
- Database clients
- System monitors
- Cross-platform apps with native features

### Live Demo Flow

1. **Show the greeting** - Basic command
2. **Fetch system info** - Complex data structures
3. **Try calculations** - Error handling
4. **Run async task** - Non-blocking operations
5. **Open DevTools** - Show the React DevTools work!
6. **Show the code** - Walk through `lib.rs` and `App.tsx`
7. **Build the app** - Show the tiny bundle size

## Additional Features to Mention

- **Auto-updater** - Built-in update mechanism
- **Plugins** - Official plugins for common tasks
- **Mobile support** - iOS and Android (beta)
- **System tray** - Native system tray integration
- **Custom protocols** - Register custom URL schemes
- **Native notifications** - Desktop notifications
- **File dialogs** - Native file pickers
- **Clipboard access** - Read/write clipboard

## Resources

- [Tauri Documentation](https://tauri.app)
- [Tauri Examples](https://github.com/tauri-apps/tauri/tree/dev/examples)
- [Awesome Tauri](https://github.com/tauri-apps/awesome-tauri)
- [Tauri Discord](https://discord.gg/tauri)

## License

This demo is for educational purposes.
