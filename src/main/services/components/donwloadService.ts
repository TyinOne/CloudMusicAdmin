import {IDownloadFile, INewDownloadFile} from "@main/services/interface";
import {getFileName, guid, isExistFile, pathJoin} from "@main/utils/downloadUtils";
import {addDownloadItem, download, isExistItem, setDownloadStore, updateDownloadItem} from "@main/utils/commonUtils";

import {DownloadItem, WebContents} from "electron";

export class DownloadService {

    public downloadItemData: IDownloadFile[]
    public downloadCompletedIds: string[]
    public tempDownloadItemIds: string[]
    public newDownloadItem: INewDownloadFile | null

    constructor() {
        this.downloadItemData = []
        this.downloadCompletedIds = []
        this.tempDownloadItemIds = []
    }

    /**
     * 下载文件
     * @param newItem - 新下载项
     * @param sender
     */
    downloadFile = (newItem: INewDownloadFile, sender: any) => {
        const {url, fileName, path: savePath} = newItem
        const newFileName = getFileName(fileName ?? '', url) // 处理文件名

        // 处理保存路径
        const downloadPath = pathJoin(savePath, newFileName)
        // 查找下载记录中是否存在历史下载
        const existItem = isExistItem(url, this.downloadItemData)

        newItem.fileName = newFileName
        newItem.path = downloadPath

        // 判断是否存在
        if (isExistFile(downloadPath)) {
            const id = existItem?.id || guid()
            // newItem.fileName = newFileName.indexOf('.') > -1 ?
        }
        if (existItem) {
            this.retryDownloadFile({...existItem, ...newItem}, sender)
            return null
        }
        this.newDownloadItem = {
            url,
            fileName: newFileName,
            path: downloadPath,
        }
        download(url, sender)
    }

    /**
     * 重新下载
     * @param data - 下载项
     * @param sender
     */
    retryDownloadFile = (data: IDownloadFile, sender: any) => {
        this.newDownloadItem = {
            fileName: data.fileName,
            path: data.path,
            url: data.url,
        }
        this.tempDownloadItemIds.push(data.id)
        download(data.url, sender)
    }

    listenerDownload = async (event: Event,
                              item: DownloadItem,
                              webContents: WebContents): Promise<void> => {
        console.log('will-download')
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
        // 更新下载
        item.on('updated', (e, state) => {
            prevReceivedBytes = updateDownloadItem({
                item,
                downloadItem,
                data: this.downloadItemData,
                prevReceivedBytes,
                state,
            })
            //更新任务状态
        })
        // 下载完成
        item.on('done', (e, state) => {
            downloadItem.state = state
            downloadItem.receivedBytes = item.getReceivedBytes()

            if (state !== 'cancelled') {
                this.downloadCompletedIds.push(downloadItem.id)
            }
            setDownloadStore(this.downloadItemData)
            //更新任务状态
        })

    }
}