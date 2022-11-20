import config from '@config/index'
import menuconfig from '../config/menu'
import {app, BrowserWindow, dialog, Menu} from 'electron'
import {loadingURL, winURL} from '../config/StaticPath'
import {join} from "path"
import {mainWindowConfig} from "../config/windowsConfig"
import {AppIpcService} from "@main/services/components/ipcService";
import {DownloadService} from "@main/services/components/donwloadService";
import {UserManager} from "@main/services/UserManager";

class MainInit {

    public winURL: string = ''
    public shartURL: string = ''
    public loadWindow: BrowserWindow = null
    public mainWindow: BrowserWindow = null
    public ipcService: AppIpcService = null
    public downloadService: DownloadService = null
    public userManager: UserManager = null

    constructor() {
        this.winURL = winURL
        this.shartURL = loadingURL
        if (process.env.NODE_ENV === 'development') {
            menuconfig.push({
                label: '开发者设置',
                submenu: [{
                    label: '切换到开发者模式',
                    accelerator: 'CmdOrCtrl+I',
                    role: 'toggledevtools'
                }]
            })
        }
        this.ipcService = new AppIpcService(app)
        this.downloadService = new DownloadService()
    }

    // 主窗口函数
    createMainWindow() {
        this.mainWindow = new BrowserWindow({
            titleBarStyle: config.IsUseSysTitle ? 'default' : 'hidden',
            ...Object.assign(mainWindowConfig, {
                webPreferences: {
                    webSecurity: false,
                    preload: process.env.NODE_ENV === 'development'
                        ? join(app.getAppPath(), 'preload.js')
                        : join(app.getAppPath(), "dist", "electron", "main", "preload.js")
                }
            })
        })

        // 赋予模板
        const menu = Menu.buildFromTemplate(menuconfig as any)
        // 加载模板
        Menu.setApplicationMenu(menu)
        // 加载主窗口
        this.mainWindow.loadURL(this.winURL).then(r => {})
        // dom-ready之后显示界面
        this.mainWindow.once('ready-to-show', () => {
            this.mainWindow.show()
            if (config.UseStartupChart) this.loadWindow.destroy()
        })
        // 当确定渲染进程卡死时，分类型进行告警操作
        app.on('render-process-gone', (event, webContents, details) => {
            const message = {
                title: "",
                buttons: [],
                message: '',
            }
            switch (details.reason) {
                case 'crashed':
                    message.title = "警告"
                    message.buttons = ['确定', '退出']
                    message.message = "图形化进程崩溃，是否进行软重启操作？"
                    break;
                case 'killed':
                    message.title = "警告"
                    message.buttons = ['确定', '退出']
                    message.message = "由于未知原因导致图形化进程被终止，是否进行软重启操作？"
                    break;
                case 'oom':
                    message.title = "警告"
                    message.buttons = ['确定', '退出']
                    message.message = "内存不足，是否软重启释放内存？"
                    break;

                default:
                    break;
            }
            dialog.showMessageBox(this.mainWindow, {
                type: 'warning',
                title: message.title,
                buttons: message.buttons,
                message: message.message,
                noLink: true
            }).then(res => {
                if (res.response === 0) this.mainWindow.reload()
                else this.mainWindow.close()
            })
        })

        //初始化开发者工具状态
        this.mainWindow.webContents.on('devtools-opened', event => {
            this.mainWindow.webContents.send('devtools-status', true)
        })
        this.mainWindow.webContents.on('devtools-closed', event => {
            this.mainWindow.webContents.send('devtools-status', false)
        })
        // 禁用链接打开
        this.mainWindow.webContents.setWindowOpenHandler((details) => {
            require('electron').shell.openExternal(details.url);
            return {action: 'deny'}
        })
        // 不知道什么原因，反正就是这个窗口里的页面触发了假死时执行
        this.mainWindow.on('unresponsive', () => {
            dialog.showMessageBox(this.mainWindow, {
                type: 'warning',
                title: '警告',
                buttons: ['重置', '退出'],
                message: '程序无响应，是否等待其恢复？',
                noLink: true
            }).then(res => {
                if (res.response === 0) this.mainWindow.reload()
                else this.mainWindow.close()
            })
        })
        /**
         * 新的gpu崩溃检测，详细参数详见：http://www.electronjs.org/docs/api/app
         * @returns {void}
         * @author tyin
         * @date 2022-03-27
         */
        app.on('child-process-gone', (event, details) => {
            const message = {
                title: "",
                buttons: [],
                message: '',
            }
            switch (details.type) {
                case 'GPU':
                    switch (details.reason) {
                        case 'crashed':
                            message.title = "警告";
                            message.buttons = ['确定', '退出'];
                            message.message = "硬件加速进程已崩溃，是否关闭硬件加速并重启？";
                            break;
                        case 'killed':
                            message.title = "警告";
                            message.buttons = ['确定', '退出'];
                            message.message = "硬件加速进程被意外终止，是否关闭硬件加速并重启？";
                            break;
                        default:
                            break;
                    }
                    break;

                default:
                    break;
            }
            dialog.showMessageBox(this.mainWindow, {
                type: 'warning',
                title: message.title,
                buttons: message.buttons,
                message: message.message,
                noLink: true
            }).then(res => {
                // 当显卡出现崩溃现象时使用该设置禁用显卡加速模式。
                if (res.response === 0) {
                    if (details.type === 'GPU') app.disableHardwareAcceleration();
                    this.mainWindow.reload()
                } else {
                    this.mainWindow.close()
                }
            })
        })
        this.mainWindow.on('closed', () => {
            this.mainWindow = null
        })
    }

    // 加载窗口函数
    loadingWindow(loadingURL: string) {
        this.loadWindow = new BrowserWindow({
            width: 400,
            height: 600,
            frame: false,
            skipTaskbar: true,
            transparent: true,
            resizable: false,
            webPreferences: {
                experimentalFeatures: true,
                preload: process.env.NODE_ENV === 'development'
                    ? join(app.getAppPath(), 'preload.js')
                    : join(app.getAppPath(), 'dist/electron/main/preload.js')
            }
        })

        this.loadWindow.loadURL(loadingURL)
        this.loadWindow.show()
        this.loadWindow.setAlwaysOnTop(true)
        setTimeout(() => {
            this.createMainWindow()
        }, 500)
    }

    // 初始化窗口函数
    windowStarter() {
        return config.UseStartupChart ? this.loadingWindow(this.shartURL) : this.createMainWindow()

    }
}

export default MainInit
