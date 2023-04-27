// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_window_state::StateFlags;

#[tauri::command]
fn get_environment_variable(name: &str) -> String {
    std::env::var(name).unwrap_or_else(|_| "".to_string())
}

fn main() {
    let flags = StateFlags::POSITION | StateFlags::SIZE;
    let windows_state_plugin = tauri_plugin_window_state::Builder::default()
        .with_state_flags(flags)
        .build();

    tauri::Builder::default()
        .plugin(windows_state_plugin)
        .invoke_handler(tauri::generate_handler![get_environment_variable])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
