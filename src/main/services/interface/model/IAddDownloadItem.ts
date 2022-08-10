import {DownloadItem} from "electron";
import {IDownloadFile} from "@main/services/interface/model/IDownloadFile";
import {INewDownloadFile} from "@main/services/interface/model/INewDownloadFile";

export interface IAddDownloadItem {
    item: DownloadItem
    downloadIds: string[]
    data: IDownloadFile[]
    newDownloadItem: INewDownloadFile | null
}