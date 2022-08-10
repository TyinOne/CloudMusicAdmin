import {DownloadItem} from "electron";
import {DownloadItemState} from "@main/services/interface/type/DownloadItemState";
import {IDownloadFile} from "@main/services/interface/model/IDownloadFile";

export interface IUpdateDownloadItem {
    item: DownloadItem
    data: IDownloadFile[]
    downloadItem: IDownloadFile
    prevReceivedBytes: number
    state: DownloadItemState
}