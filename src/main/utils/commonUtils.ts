import {app, BrowserWindow, DownloadItem} from 'electron'
import {
    IAddDownloadItem,
    IDownloadBytes,
    IDownloadFile,
    IPagination,
    IUpdateDownloadItem,
} from '@main/services/interface'
import {getBase64Bytes, getFileIcon, getFileName, guid} from '@main/utils/downloadUtils'

/**
 * 获取下载中的字节数据
 * @param data - 下载项
 */
export const getDownloadBytes = (data: IDownloadFile[]): IDownloadBytes => {
    return data.reduce<IDownloadBytes>(
        (prev, current) => {
            if (current.state === 'progressing') {
                prev.receivedBytes += current.receivedBytes
                prev.totalBytes += current.totalBytes
            }

            return prev
        },
        {receivedBytes: 0, totalBytes: 0},
    )
}

/**
 * 获取下载项
 * @param data - 下载记录
 * @param id - 下载项 id
 */
export const getDownloadItem = (data: IDownloadFile[], id: string): DownloadItem | null => {
    const newData = data.filter(item => item.id === id)

    if (!newData.length) return null
    return newData[0]?._sourceItem || null
}

/**
 * 获取下载项下标
 * @param data - 下载记录
 * @param id - 下载项 id
 */
export const getDownloadIndex = (data: IDownloadFile[], id: string): number =>
    data.findIndex(item => item.id === id)

/**
 * 是否存在下载项
 * @param url - 下载地址
 * @param data - 下载记录
 */
export const isExistItem = (url: string, data: IDownloadFile[]): IDownloadFile | null => {
    const item = data.filter(d => d.url === url)

    return item.length ? item[0] : null
}

/**
 * 下载
 * @param url - 下载地址
 * @param sender
 */
export const download = (url: string, sender: any): void => {
    if (!sender) return
    BrowserWindow.fromWebContents(sender).webContents.downloadURL(url)
}

/**
 * 保存下载记录
 * @param data - 下载项
 */
export const setDownloadStore = (data: IDownloadFile[]): void => {
    // store.set('downloadManager', data)
}

/**
 * 获取下载记录
 */
export const getDownloadStore = (): IDownloadFile[] => {
    // store.get('downloadManager', []) as IDownloadFile[]
    return []
}

/**
 * 添加下载项
 * @param param
 */
export const addDownloadItem = async ({
                                          item,
                                          downloadIds,
                                          data,
                                          newDownloadItem,
                                      }: IAddDownloadItem): Promise<IDownloadFile> => {
    const id = downloadIds.shift() || ''
    // 判断下载项是否存在，存在先移除，再添加
    const itemIndex = getDownloadIndex(data, id)

    const fileUrl = item.getURL()
    const fileName = getFileName(newDownloadItem?.fileName || '', item.getFilename())
    const startTime = item.getStartTime() * 1000
    const totalBytes = getBase64Bytes(fileUrl) || item.getTotalBytes()

    let fileId = guid()
    const savePath = newDownloadItem?.path || app.getPath('downloads')

    if (itemIndex > -1) {
        const newItems = data.splice(itemIndex, 1)
        const newItem = newItems[0]

        fileId = newItem.id
        if (newItem.paused) {
            item.pause()
        }
    }

    // 阻止系统保存对话框
    item.setSavePath(savePath)

    const fileIcon = await getFileIcon(savePath)
    const downloadItem: IDownloadFile = {
        id: fileId,
        url: fileUrl,
        icon: fileIcon,
        fileName,
        path: savePath,
        state: item.getState(),
        startTime,
        speed: 0,
        progress: 0,
        totalBytes,
        receivedBytes: item.getReceivedBytes(),
        paused: item.isPaused(),
        _sourceItem: item,
    }

    data.unshift(downloadItem)
    console.log('add')
    console.log(data)
    setDownloadStore(data)
    // 清空缓存数据
    newDownloadItem = null

    return downloadItem
}

/**
 * 更新下载中数据
 * @param item - 下载项，electron 生成的对象
 * @param downloadItem - 更新的下载项
 * @param data
 * @param prevReceivedBytes - 上一次下载字节数
 * @param state - 下载状态
 */
export const updateDownloadItem = ({
                                       item,
                                       downloadItem,
                                       data,
                                       prevReceivedBytes,
                                       state,
                                   }: IUpdateDownloadItem): number => {
    const receivedBytes = item.getReceivedBytes()

    downloadItem.receivedBytes = receivedBytes
    // 计算每秒下载的速度
    downloadItem.speed = receivedBytes - prevReceivedBytes

    downloadItem.progress = receivedBytes / downloadItem.totalBytes
    downloadItem.state = state
    downloadItem.paused = item.isPaused()

    setDownloadStore(data)
    return receivedBytes
}

// 初始化下载数据，并按时间倒序排
export const initDownloadData = (): IDownloadFile[] => {
    return getDownloadStore().sort((a, b) => Math.floor(b.startTime) - Math.floor(a.startTime))
}

/**
 * 移除下载数据中的 _sourceItem 属性
 * @param data - 下载数据
 */
export const deleteSourceItem = (data: IDownloadFile[]): IDownloadFile[] => {
    data = data.map(item => ({...item, _sourceItem: undefined}))
    return data
}

/**
 * 分页获取下载数据
 * @param param
 * pageIndex - 当前页
 * pageCount - 每页数
 * @param data
 */
export const getDownloadData = (
    data: IDownloadFile[],
    {pageIndex = 1, pageCount = 10}: IPagination,
): IDownloadFile[] => {
    data = deleteSourceItem(data)

    const query = (pageIndex - 1) * pageCount
    return query + pageCount >= data.length
        ? data.slice(query, data.length)
        : data.slice(query, query + pageCount)
}