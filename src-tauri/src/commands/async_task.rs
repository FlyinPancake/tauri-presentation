#[tauri::command]
pub async fn async_task(duration: u64) -> String {
    // Simulate async work
    tokio::time::sleep(tokio::time::Duration::from_secs(duration)).await;
    format!("Async task completed after {} seconds", duration)
}
