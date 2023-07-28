use directories::UserDirs;
use std::path::PathBuf;

#[cfg(target_os = "linux")]
use std::{fs::metadata, path::PathBuf};
use std::process::Command;

#[cfg(target_os = "linux")]
use fork::{daemon, Fork};

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


#[tauri::command]
pub fn show_in_folder(path: String) {
  #[cfg(target_os = "windows")]
  {
    Command::new("explorer")
        .args(["/select,", &path]) // The comma after select is not a typo
        .spawn()
        .unwrap();
  }

  #[cfg(target_os = "linux")]
  {
    if path.contains(",") {
      // see https://gitlab.freedesktop.org/dbus/dbus/-/issues/76
      let new_path = match metadata(&path).unwrap().is_dir() {
        true => path,
        false => {
          let mut path2 = PathBuf::from(path);
          path2.pop();
          path2.into_os_string().into_string().unwrap()
        }
      };
      Command::new("xdg-open")
          .arg(&new_path)
          .spawn()
          .unwrap();
    } else {
      if let Ok(Fork::Child) = daemon(false, false) {
        Command::new("dbus-send")
            .args(["--session", "--dest=org.freedesktop.FileManager1", "--type=method_call",
                  "/org/freedesktop/FileManager1", "org.freedesktop.FileManager1.ShowItems",
                  format!("array:string:\"file://{path}\"").as_str(), "string:\"\""])
            .spawn()
            .unwrap();
      }
    }
  }

  #[cfg(target_os = "macos")]
  {
    Command::new("open")
        .args(["-R", &path])
        .spawn()
        .unwrap();
  }
}