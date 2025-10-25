use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{AppHandle, Emitter};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemInfo {
    os: String,
    arch: String,
    hostname: String,
    timestamp: u64,
}

#[tauri::command]
fn get_system_info() -> SystemInfo {
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();

    SystemInfo {
        os: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
        hostname: hostname::get()
            .unwrap_or_default()
            .to_string_lossy()
            .to_string(),
        timestamp,
    }
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
enum Operation {
    Add,
    Subtract,
    Multiply,
    Divide,
}

#[tauri::command]
fn perform_calculation(a: i32, b: i32, operation: Operation) -> Result<i32, String> {
    match operation {
        Operation::Add => Ok(a + b),
        Operation::Subtract => Ok(a - b),
        Operation::Multiply => Ok(a * b),
        Operation::Divide => {
            if b == 0 {
                Err("Cannot divide by zero".to_string())
            } else {
                Ok(a / b)
            }
        }
        _ => Err(format!("Unknown operation: {operation:?}")),
    }
}

#[tauri::command]
async fn async_task(duration: u64) -> String {
    // Simulate async work
    tokio::time::sleep(tokio::time::Duration::from_secs(duration)).await;
    format!("Async task completed after {} seconds", duration)
}

#[derive(Clone, Serialize)]
struct ProgressUpdate {
    current: u32,
    total: u32,
    message: String,
}

#[tauri::command]
async fn start_progress_task(app: AppHandle) -> Result<String, String> {
    // Spawn a background task that emits progress events
    tokio::spawn(async move {
        let total = 10;
        for i in 1..=total {
            let progress = ProgressUpdate {
                current: i,
                total,
                message: format!("Processing step {} of {}", i, total),
            };

            // Emit event to frontend
            if let Err(e) = app.emit("progress-update", progress) {
                eprintln!("Failed to emit event: {}", e);
            }

            tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;
        }

        // Emit completion event
        let _ = app.emit("progress-complete", "Task completed successfully!");
    });

    Ok("Progress task started".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_system_info,
            perform_calculation,
            async_task,
            start_progress_task
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
