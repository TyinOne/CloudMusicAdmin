import {IDownloadFile, INewDownloadFile} from "@main/services/interface";
import {getFileName, guid, isExistFile, pathJoin, removeFile} from "@main/utils/downloadUtils";
import {
    addDownloadItem,
    download,
    getDownloadConfigFromStore,
    getDownloadItem,
    initDownloadData,
    isExistItem,
    setDownloadStore,
    updateDownloadItem
} from "@main/utils/commonUtils";

import {BrowserWindow, DownloadItem, WebContents} from "electron";
import {IDownloadConfig} from "@main/services/interface/model/IDownloadConfig";

export class DownloadService {

    public downloadItemData: IDownloadFile[]
    public downloadCompletedIds: string[]
    public tempDownloadItemIds: string[]
    public downloadConfig: IDownloadConfig
    public newDownloadItem: INewDownloadFile | null

    constructor() {
        this.downloadItemData = initDownloadData()
        this.downloadConfig = getDownloadConfigFromStore()
        this.downloadCompletedIds = []
        this.tempDownloadItemIds = []
    }

    /**
     * 下载文件
     * @param newItem - 新下载项
     * @param sender
     */
    downloadFile = async (newItem: INewDownloadFile, sender: any) => {
        const {url, fileName, path: savePath} = newItem
        const newFileName = getFileName(fileName ?? '', url) // 处理文件名

        // 处理保存路径
        const downloadPath = pathJoin(savePath, newFileName)
        // 查找下载记录中是否存在历史下载
        const existItem = isExistItem(url, this.downloadItemData)

        newItem.fileName = newFileName
        newItem.path = downloadPath

        // 判断是否存在
        if (isExistFile(downloadPath) && existItem) {
            const id = existItem?.id || guid()
            //将下一步操作转移给渲染进程控制
            BrowserWindow.fromWebContents(sender).webContents.send('downloadFileExist', {
                id,
                url,
                fileName: newFileName,
                path: downloadPath
            })
            return
        }
        this.newDownloadItem = {
            url,
            fileName: newFileName,
            path: downloadPath,
        }
        download(url, sender)
    }

    removeDownloadItem = (item: IDownloadFile, id: string) => {
        const sourceItem = getDownloadItem(this.downloadItemData, item.id)
        this.downloadItemData = this.downloadItemData.filter(i => i.id !== id)
        // 如果下载项的状态是下载中，需要取消
        if (item.state === 'progressing') {
            sourceItem && sourceItem.cancel()
        }

        this.downloadCompletedIds = this.downloadCompletedIds.filter(id => id !== item.id)
        setDownloadStore(this.downloadItemData)
        return item
    }
    getDownLoadConfig = (): IDownloadConfig => {
        return this.downloadConfig
    }

    pauseOrResume = async (item: IDownloadFile, sender: any) => {
        const sourceItem = getDownloadItem(this.downloadItemData, item.id)
        if (!sourceItem) return item
        if (item.paused || sourceItem.isPaused()) {
            sourceItem.resume()
        } else {
            sourceItem.pause()
        }

        item.paused = sourceItem.isPaused()
        setDownloadStore(this.downloadItemData)
        return item
    }

    /**
     * 重新下载
     * @param data - 下载项
     * @param sender
     */
    retryDownloadFile = (data: IDownloadFile, sender: any) => {
        removeFile(data.path)
        this.newDownloadItem = {
            fileName: data.fileName,
            path: data.path,
            url: data.url,
        }
        this.tempDownloadItemIds.push(data.id)
        download(data.url, sender)
    }
    /** 恢复下载 */
    getInterruptedDownload = (): IDownloadFile[] => {
        let arr = this.downloadItemData.filter(i => i.state !== 'progressing')
        console.log(arr)
        return []
    }

    /**
     * 监听器
     * @param event
     * @param item
     * @param webContents
     */
    listenerDownload = async (event: Event,
                              item: DownloadItem,
                              webContents: WebContents): Promise<void> => {
        // 新建下载为空时，会执行 electron 默认的下载处理
        if (!this.newDownloadItem) return

        let prevReceivedBytes = 0 // 记录上一次下载的字节数据
        // 添加下载项
        const downloadItem: IDownloadFile = await addDownloadItem({
            item,
            downloadIds: this.tempDownloadItemIds,
            data: this.downloadItemData,
            newDownloadItem: this.newDownloadItem,
        })
        downloadItem.urlChain = [...downloadItem.url];
        downloadItem.mimeType = '';
        downloadItem.length = item.getTotalBytes();
        downloadItem.lastModified = item.getLastModifiedTime();
        downloadItem.eTag = item.getETag();
        // 更新下载
        item.on('updated', (e, state) => {
            downloadItem.offset = item.getReceivedBytes()//已经下载
            prevReceivedBytes = updateDownloadItem({
                item,
                downloadItem,
                data: this.downloadItemData,
                prevReceivedBytes,
                state,
            })
            //更新任务状态
            setDownloadStore(this.downloadItemData)
            webContents.send('updateTaskList')
        })
        // 下载完成
        item.on('done', (e, state) => {
            downloadItem.state = state
            downloadItem.receivedBytes = item.getReceivedBytes()

            /**
             * completed： 下载成功
             * cancelled： 取消下载
             * interrupted： 下载中断且无法恢复（下载失败需要重新下载）
             */

            if (state !== 'cancelled') {
                this.downloadCompletedIds.push(downloadItem.id)
                webContents.send('downloadSuccess', downloadItem)
            }
            setDownloadStore(this.downloadItemData)
            webContents.send('updateTaskList')
        })
        //是否可恢复下载
        // if (item.canResume) {
        //     item.resume()
        // }
    }
}