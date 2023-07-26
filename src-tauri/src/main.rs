// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_autostart::MacosLauncher;

mod clone;
mod common;
mod directory;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]),
        ))
        .invoke_handler(tauri::generate_handler![
            crate::clone::clone_gerrit_project,
            crate::common::toggle_setting_window_visible,
            crate::directory::get_home_directory,
            crate::directory::get_default_clone_directory
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
