import { WebviewWindow } from "@tauri-apps/api/window"

export const toggleQuickOpenWindowVisiable = async () => {
    const quickOpenWindow = WebviewWindow.getByLabel('quickOpenWindow')

    console.log(quickOpenWindow)

    if (quickOpenWindow) {
        const visible = await quickOpenWindow.isVisible()

        if (visible) {
            quickOpenWindow.hide()
        } else {
            quickOpenWindow.show()
            quickOpenWindow.setFocus()
        }
    } else {
        const webview = new WebviewWindow('quickOpenWindow', {
            url: 'http://localhost:1420/#/quickopen',
            titleBarStyle: "overlay",
            center: true,
            alwaysOnTop: true,
            hiddenTitle: true,
            width: 600,
            height: 400,
            resizable: false,
            focus: true,
            transparent: true,
            decorations: false

        })

        webview.onFocusChanged((isFocusEvent) => {
            if (isFocusEvent.payload === false) {
                webview.hide()
            }
        })

        webview.show()
        webview.setFocus()
    }
}