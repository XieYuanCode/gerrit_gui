use directories::UserDirs;
use std::path::PathBuf;

#[tauri::command]
pub async fn get_home_directory() -> Result<String, String> {
    if let Some(user_dirs) = UserDirs::new() {
        let home_dir = user_dirs.home_dir();

        Ok(home_dir.to_str().unwrap().into())
    } else {
        Err("没找到".into())
    }
}

#[tauri::command]
pub async fn get_default_clone_directory() -> Result<String, String> {
    let home_dir_result = get_home_directory().await;

    match home_dir_result {
        Ok(home_dir) => {
            let mut default_clone_dir = PathBuf::new();
            default_clone_dir.push(home_dir);
            default_clone_dir.push("code");
            Ok(default_clone_dir.to_str().unwrap().into())
        }
        Err(err) => Err(err.to_string()),
    }
}
