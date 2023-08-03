use std::process::Command;

#[tauri::command]
pub async fn git_command_ls_remote(remote_url: String) -> Result<bool, ()> {
    let output = Command::new("git")
        .args(["ls-remote", &remote_url])
        .output()
        .expect("Failed to execute command");

    if String::from_utf8(output.stderr).unwrap() == "" {
      Ok(true)
    } else {
      Ok(false)
    }
}
