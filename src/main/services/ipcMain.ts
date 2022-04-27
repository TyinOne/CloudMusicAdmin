import {app, BrowserWindow, dialog, ipcMain, shell} from 'electron'
import config from '@config/index'
import {winURL} from '../config/StaticPath'
import {updater} from './HotUpdater'
import DownloadFile from './downloadFile'
import Update from './checkupdate'
import {join} from 'path'
import {otherWindowConfig} from "../config/windowsConfig"

export default {
    Mainfunc() {
        const allUpdater = new Update()
        ipcMain.handle('IsUseSysTitle', async () => {
            return config.IsUseSysTitle
        })
        ipcMain.handle('windows-mini', (event, args) => {
            BrowserWindow.fromWebContents(event.sender)?.minimize()
        })
        ipcMain.handle('window-max', async (event, args) => {
            if (BrowserWindow.fromWebContents(event.sender)?.isMaximized()) {
                BrowserWindow.fromWebContents(event.sender)?.restore()
                return {status: false}
            } else {
                BrowserWindow.fromWebContents(event.sender)?.maximize()
                return {status: true}
            }
        })
        ipcMain.handle('window-close', (event, args) => {
            BrowserWindow.fromWebContents(event.sender)?.close()
        })
        ipcMain.handle('check-update', (event) => {
            allUpdater.checkUpdate(BrowserWindow.fromWebContents(event.sender))
        })
        ipcMain.handle('confirm-update', () => {
            allUpdater.quitAndInstall()
        })
        ipcMain.handle('app-close', (event, args) => {
            app.quit()
        })
        ipcMain.handle('open-messagebox', async (event, arg) => {
            return await dialog.showMessageBox(BrowserWindow.fromWebContents(event.sender), {
                type: arg.type || 'info',
                title: arg.title || '',
                buttons: arg.buttons || [],
                message: arg.message || '',
                noLink: arg.noLink || true
            })
        })
        ipcMain.handle('open-errorbox', (event, arg) => {
            dialog.showErrorBox(
                arg.title,
                arg.message
            )
        })
        ipcMain.handle('hot-update', (event, arg) => {
            updater(BrowserWindow.fromWebContents(event.sender))
        })

        ipcMain.handle('start-download', (event, msg) => {
            new DownloadFile(BrowserWindow.fromWebContents(event.sender), msg.downloadUrl).start()
        })
        ipcMain.handle('open-web', (event, arg) => {
            shell.openExternal(arg).then(r => {
            })
        })
        ipcMain.handle('open-win', (event, arg) => {
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
    }
}