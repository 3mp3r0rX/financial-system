// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    Manager, 
    RunEvent, 
    WindowBuilder, 
    WindowUrl
};
use tauri_plugin_log::{LogTarget, LoggerBuilder};

fn main() {
    // Custom logger configuration
    let log_plugin = LoggerBuilder::new()
        .targets([
            LogTarget::LogDir,
            LogTarget::Stdout,
            LogTarget::Webview,
        ])
        .level(log::LevelFilter::Debug)
        .build();

    tauri::Builder::default()
        // Add custom menu (optional)
        .setup(|app| {
            // Optional: Create additional windows
            // WindowBuilder::new(app, "secondary", WindowUrl::App("index.html".into()))
            //     .title("Secondary Window")
            //     .build()?;
            Ok(())
        })
        // Add plugins
        .plugin(log_plugin)
        // Add any custom commands here
        .invoke_handler(tauri::generate_handler![])
        // Global app event handling
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                // Optional: Custom close behavior
                // api.prevent_close();
            }
            _ => {}
        })
        // Optional: Configure system tray
        // .system_tray(SystemTray::new())
        // .on_system_tray_event(|app, event| {
        //     // Handle system tray events
        // })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Optional: Define custom Rust commands
// #[tauri::command]
// fn custom_command() {
//     // Your custom logic here
// }
