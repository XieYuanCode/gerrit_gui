use tauri::{Manager};

// 切换设置窗口
#[tauri::command]
pub async fn toggle_setting_window_visible(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(docs_window) = app.get_window("setting_window") {
        if docs_window.is_visible().unwrap() {
            let _ = docs_window.hide();
        } else {
            let _ = docs_window.show();
        }

        Ok(())
    } else {
        let docs_window = tauri::WindowBuilder::new(
            &app,
            "setting_window", /* the unique window label */
            tauri::WindowUrl::External("http://192.168.180.150:8080/gerrit".parse().unwrap()),
        )
        .build();

        match docs_window {
            Ok(window) => {
                window.set_title("Setting").unwrap();
                window.set_resizable(false).unwrap();
                let _ = window.show();
                Ok(())
            }
            Err(err) => Err(err.to_string()),
        }
    }
}
