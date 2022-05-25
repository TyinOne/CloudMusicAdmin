import {IDownloadFile, INewDownloadFile, IPagination} from "@main/services/interface";
import {deleteSourceItem, getDownloadData} from "@main/utils/commonUtils";
import {session} from "electron";
import {AppIpcService} from "@main/services/components/ipcService";
import {DownloadService} from "@main/services/components/donwloadService";

export class DownloadIPC {
    constructor(downloadService: DownloadService) {
        //获取下载数据
        AppIpcService.ipcMainHandle('getDownloadData', (event, page?: IPagination) => {
            console.log('getData')
            if (page) {
                return getDownloadData(downloadService.downloadItemData, page)
            }
            return deleteSourceItem(downloadService.downloadItemData)
        })
        // 新建下载
        AppIpcService.ipcMainHandle('newDownloadFile', (event, data: INewDownloadFile) => downloadService.downloadFile(data, event.sender))

        // 重新下载
        AppIpcService.ipcMainHandle('retryDownloadFile', (event, data: IDownloadFile) => downloadService.retryDownloadFile(data, event.sender))

        // 调用 download 方法后，触发 will-download 事件
        session.defaultSession.on('will-download', downloadService.listenerDownload)
    }
}