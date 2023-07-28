use git2::{Cred, RemoteCallbacks};
use std::env;
use std::path::Path;
use tauri::Manager;

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

// git clone "ssh://xieyuan@192.168.180.150:29418/ufe/ufe_test" && scp -p -P 29418 xieyuan@192.168.180.150:hooks/commit-msg "ufe_test/.git/hooks/"
#[tauri::command]
pub async fn clone_gerrit_project(app: tauri::AppHandle,  remote_path: String, local_path: String) -> Result<(), String> {
    let mut callbacks = RemoteCallbacks::new();

    // Prepare callbacks.
    callbacks.credentials(|_url, username_from_url, _allowed_types| {
        Cred::ssh_key(
            username_from_url.unwrap(),
            None,
            std::path::Path::new(&format!("{}/.ssh/id_rsa", env::var("HOME").unwrap())),
            None,
        )
    });
    callbacks.transfer_progress(|progress| {
        let total_objects = progress.total_objects();
        let received_objects = progress.received_objects();

        app.emit_all(
            "clone_total_objects_updated",
            Payload {
                message: total_objects.to_string(),
            },
        )
        .unwrap();
        app.emit_all(
            "clone_received_objects_updated",
            Payload {
                message: received_objects.to_string(),
            },
        )
        .unwrap();

        return true;
    });

    // Prepare fetch options.
    let mut fo = git2::FetchOptions::new();
    fo.remote_callbacks(callbacks);

    // Prepare builder
    let mut builder = git2::build::RepoBuilder::new();
    builder.fetch_options(fo);

    // Clone the project
    let result = builder.clone(
        // "ssh://xieyuan@192.168.180.150:29418/ufe/aep-base",
        &remote_path,
        Path::new(&local_path),
    );

    match result {
        Ok(_v) => Ok(()),
        Err(e) => Err(e.message().into())
    }

}
