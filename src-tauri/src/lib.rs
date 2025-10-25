mod commands;
use crate::commands::{
    async_task, get_system_info, greet, perform_calculation, start_progress_task,
};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

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
