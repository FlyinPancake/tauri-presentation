#[tauri::command]
pub fn greet(name: &str) -> Result<String, String> {
    if name.is_empty() {
        return Err("Don't be so shy, introduce yourself".to_string());
    }
    Ok(format!("Hello, {}! You've been greeted from Rust!", name))
}
