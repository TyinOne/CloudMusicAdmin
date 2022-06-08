import {IDownloadFile, INewDownloadFile, IPagination} from "@main/services/interface";
import {deleteSourceItem, getDownloadData} from "@main/utils/commonUtils";
import {session} from "electron";
import {AppIpcService} from "@main/services/components/ipcService";
import {DownloadService} from "@main/services/components/donwloadService";
import {openFileDialog} from "@main/utils/downloadUtils";
import store from "@main/services/store";
import {IDownloadConfig} from "@main/services/interface/model/IDownloadConfig";

export class DownloadIPC {
    constructor(downloadService: DownloadService) {
        //获取下载数据
        AppIpcService.ipcMainHandle('getDownloadData', (event, page?: IPagination) => {
            if (page) {
                return getDownloadData(downloadService.downloadItemData, page)
            }
            return deleteSourceItem(downloadService.downloadItemData)
        })
        // 新建下载
        AppIpcService.ipcMainHandle('newDownloadFile', (event, data: INewDownloadFile) => downloadService.downloadFile(data, event.sender))

        // 暂停
        AppIpcService.ipcMainHandle('pauseOrResume', (event, data: IDownloadFile) => {
            return downloadService.pauseOrResume(data, event.sender)
        })

        // 重新下载
        AppIpcService.ipcMainHandle('retryDownloadFile', (event, data: IDownloadFile) => downloadService.retryDownloadFile(data, event.sender))

        // 彻底删除任务
        AppIpcService.ipcMainHandle('removeDownloadItemFile', (event, data: IDownloadFile) => downloadService.removeDownloadItem(data, data.id))

        // 选择保存位置对话框
        AppIpcService.ipcMainHandle('openFileDialog', async (event, oldPath?: string) => {
            let path = await openFileDialog(oldPath);
            let config: IDownloadConfig = {
                path: path
            }
            // @ts-ignore
            store.delete('downloadConfig')
            store.set('downloadConfig', config)
            downloadService.downloadConfig = config
            return path
        })

        // 获取保存的下载位置
        AppIpcService.ipcMainHandle('getDownloadConfig', (event) => {
            return downloadService.getDownLoadConfig()
        })

        // 调用 download 方法后，触发 will-download 事件
        session.defaultSession.on('will-download', downloadService.listenerDownload)
        // 恢复下载
        downloadService.getInterruptedDownload().forEach(i => {
            session.defaultSession.createInterruptedDownload({
                path: i.path,
                urlChain: i.urlChain,
                offset: i.offset,
                length: i.length,
                lastModified: i.lastModified,
                eTag: i.eTag,
                startTime: i.startTime,
            })
        })
    }
}