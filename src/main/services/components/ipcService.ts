import {IPCEventName} from "@main/services/interface/type/IPCEventName";
import {app, BrowserWindow, dialog, ipcMain, IpcMainInvokeEvent, shell} from "electron";
import config from "@config/index";
import {otherWindowConfig} from "@main/config/windowsConfig";
import {join} from "path";
import {winURL} from "@main/config/StaticPath";
import {UpdateIPC} from "@main/services/ipc/updateIPC";
import {DownloadIPC} from "@main/services/ipc/downloadIPC";
import {DownloadService} from "@main/services/components/donwloadService";
import {openFileInFolder} from "@main/utils/downloadUtils";
// import {UserManager} from "@main/services/UserManager";
// import App = Electron.App;

/**
 * 应用级事件监听
 */
export class AppIpcService {
    public updateIpc: UpdateIPC = null
    public downloadIpc: DownloadIPC = null;

    // public app:App;
    constructor() {
        // this.app = app
        this.updateIpc = new UpdateIPC()
        this.downloadIpc = new DownloadIPC(new DownloadService())
        AppIpcService.ipcMainHandle('IsUseSysTitle', async () => {
            return config.IsUseSysTitle
        })
        AppIpcService.ipcMainHandle('windowsMini', (event, args) => {
            BrowserWindow.fromWebContents(event.sender)?.minimize()
        })
        AppIpcService.ipcMainHandle('windowMax', async (event, args) => {
            if (BrowserWindow.fromWebContents(event.sender)?.isMaximized()) {
                BrowserWindow.fromWebContents(event.sender)?.restore()
                return {status: false}
            } else {
                BrowserWindow.fromWebContents(event.sender)?.maximize()
                return {status: true}
            }
        })
        AppIpcService.ipcMainHandle('windowClose', (event, args) => {
            BrowserWindow.fromWebContents(event.sender)?.close()
        })
        AppIpcService.ipcMainHandle('appClose', (event, args) => {
            app.quit()
        })
        AppIpcService.ipcMainHandle('openMessageBox', async (event, arg) => {
            return await dialog.showMessageBox(BrowserWindow.fromWebContents(event.sender), {
                type: arg.type || 'info',
                title: arg.title || '',
                buttons: arg.buttons || [],
                message: arg.message || '',
                noLink: arg.noLink || true
            })
        })
        AppIpcService.ipcMainHandle('openErrorBox', (event, arg) => {
            dialog.showErrorBox(
                arg.title,
                arg.message
            )
        })
        AppIpcService.ipcMainHandle('openWeb', (event, arg) => {
            shell.openExternal(arg)
        })
        AppIpcService.ipcMainHandle('openDevtools', (event, arg) => {
            let isOpen = BrowserWindow.fromWebContents(event.sender).webContents.isDevToolsOpened()
            if (isOpen) {
                BrowserWindow.fromWebContents(event.sender).webContents.closeDevTools()
            } else {
                BrowserWindow.fromWebContents(event.sender).webContents.openDevTools(arg)
            }
        })
        AppIpcService.ipcMainHandle('devtoolsStatus', async (event) => {
            return BrowserWindow.fromWebContents(event.sender).webContents.isDevToolsOpened()
        })
        AppIpcService.ipcMainHandle('openWin', (event, arg) => {
            const ChildWin = new BrowserWindow({
                titleBarStyle: config.IsUseSysTitle ? 'default' : 'hidden',
                ...Object.assign(otherWindowConfig, {
                    webPreferences: {
                        preload: process.env.NODE_ENV === 'development'
                            ? join(app.getAppPath(), 'preload.js')
                            : join(app.getAppPath(), 'dist', 'electron', 'main', 'preload.js')
                    }
                })
            })
            // 开发模式下自动开启devtools
            if (process.env.NODE_ENV === 'development') {
                ChildWin.webContents.openDevTools({mode: 'undocked', activate: true})
            }
            ChildWin.loadURL(winURL + `#${arg.url}`)
            ChildWin.once('ready-to-show', () => {
                ChildWin.show()
                if (arg.IsPay) {
                    // 检查支付时候自动关闭小窗口
                    const testUrl = setInterval(() => {
                        const Url = ChildWin.webContents.getURL()
                        if (Url.includes(arg.PayUrl)) {
                            ChildWin.close()
                        }
                    }, 1200)
                    ChildWin.on('close', () => {
                        clearInterval(testUrl)
                    })
                }
            })
            // 渲染进程显示时触发
            ChildWin.once("show", () => {
                ChildWin.webContents.send('send-data', arg.sendData)
            })
        })


        AppIpcService.ipcMainHandle('openFileInFolder', ((event, args) => {
            openFileInFolder(args.path);
        }))

        AppIpcService.ipcMainHandle('openFile', ((event, args) => {
        }))

        AppIpcService.ipcMainHandle('userLogin', ((event, args) => {
            // let userManager = new UserManager();
            // userManager.init(app, {userAccount: args.account})
        }))
    }

    static ipcMainHandle = <T>(
        eventName: IPCEventName,
        listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<T> | void | T,
    ): void => {
        ipcMain.handle(eventName, async (event, ...args: any[]) => {
            return listener(event, ...args)
        })
    }
}