use serde::Serialize;
use tauri::{AppHandle, Emitter};

#[derive(Clone, Serialize)]
pub struct ProgressUpdate {
    current: u32,
    total: u32,
    message: String,
}

#[tauri::command]
pub async fn start_progress_task(app: AppHandle) -> Result<String, String> {
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
