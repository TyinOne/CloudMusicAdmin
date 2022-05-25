import {AppIpcService} from "@main/services/components/ipcService";
import {BrowserWindow} from "electron";
import {updater} from "@main/services/HotUpdater";
import UpdateFile from "@main/services/updateFile";
import Update from "@main/services/checkupdate";

export class UpdateIPC {
    private allUpdater: Update = new Update()

    constructor() {
        AppIpcService.ipcMainHandle('checkUpdate', (event) => {
            this.allUpdater.checkUpdate(BrowserWindow.fromWebContents(event.sender))
        })
        AppIpcService.ipcMainHandle('confirmUpdate', () => {
            this.allUpdater.quitAndInstall()
        })
        AppIpcService.ipcMainHandle('hotUpdate', (event, arg) => {
            updater(BrowserWindow.fromWebContents(event.sender))
        })
        AppIpcService.ipcMainHandle('startDownload', (event, msg) => {
            new UpdateFile(BrowserWindow.fromWebContents(event.sender), msg.downloadUrl).start()
        })
    }
}