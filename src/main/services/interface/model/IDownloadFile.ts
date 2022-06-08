import {DownloadItem} from "electron";
import {DownloadItemState} from "@main/services/interface/type/DownloadItemState";

export interface IDownloadFile {
    id: string
    url: string
    icon: string
    fileName: string
    path: string
    state: DownloadItemState
    startTime: number
    speed: number
    progress: number
    totalBytes: number
    receivedBytes: number
    _sourceItem: DownloadItem | undefined,
    paused: boolean,
    urlChain?: string[],
    mimeType?: string,
    offset?: number,
    length?: number,
    lastModified?: string,
    eTag?: string,
}