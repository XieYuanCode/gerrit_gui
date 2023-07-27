use ssh_config::SSHConfig;
use std::path::PathBuf;
use tauri::api::{dir, file, path};

#[tauri::command]
pub async fn get_local_ssh_configs() -> Result<String, String> {
    let home_dir_result = path::home_dir();

    let home_dir = home_dir_result.unwrap();
    let mut ssh_dir: PathBuf = PathBuf::new();
    ssh_dir.push(home_dir);
    ssh_dir.push(".ssh");

    let is_ssh_dir_exist_result = dir::is_dir(ssh_dir);
    match is_ssh_dir_exist_result {
        Ok(exist) => {
            if exist == true {
                let mut ssh_pub_file_path = PathBuf::new();
                let home_dir = path::home_dir().unwrap();
                ssh_pub_file_path.push(home_dir);
                ssh_pub_file_path.push(".ssh");
                ssh_pub_file_path.push("id_rsa.pub");
                let ssh_pub_file_content = file::read_string(ssh_pub_file_path);
                match ssh_pub_file_content {
                    Ok(content) => Ok(content),
                    Err(_err) => Err("ssh file not exist".into()),
                }
            } else {
                Err("ssh dir not exist".into())
            }
        }
        Err(_err) => Err("ssh dir not exist".into()),
    }

    // Ok(())
}

#[tauri::command]
pub async fn is_ssh_config_available(user_name: String) -> Result<bool, String> {
    let mut ssh_config_file_path = PathBuf::new();
    ssh_config_file_path.push(path::home_dir().unwrap());
    ssh_config_file_path.push(".ssh");
    ssh_config_file_path.push("config");

    let ssh_config_file_content = file::read_string(ssh_config_file_path);

    match ssh_config_file_content {
        Ok(file_content) => {
            let ssh_config_result = SSHConfig::parse_str(&file_content);

            match ssh_config_result {
                Ok(ssh_config) => {
                    let host_settings = ssh_config.query("192.168.180.150");
                    let port = host_settings["Port"];

                    println!("{}", port);

                    if port == "8080" {
                        if host_settings["PubkeyAcceptedKeyTypes"] != "+ssh-rsa" {
                            Ok(false.into())
                        } else if host_settings["IdentityFile"] != "~/.ssh/id_rsa" {
                            Ok(false.into())
                        } else if host_settings["User"] != user_name {
                            Ok(false.into())
                        } else {
                            Ok(true.into())
                        }
                    } else {
                        Ok(false.into())
                    }
                }
                Err(_err) => Err("parse ssh config file error".into()),
            }
        }
        Err(_err) => Err("read ssh config file error".into()),
    }
}
