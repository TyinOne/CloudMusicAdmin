export type IPCEventName =
    | 'openDownloadManager'
    | 'getDownloadData'
    | 'newDownloadFile'
    | 'retryDownloadFile'
    | 'openFileDialog'
    | 'openFile'
    | 'openFileInFolder'
    | 'initDownloadItem'
    | 'pauseOrResume'
    | 'removeDownloadItem'
    | 'removeDownloadItemFile'
    | 'newDownloadItem'
    | 'downloadItemUpdate'
    | 'downloadItemDone'
    | 'IsUseSysTitle'
    | 'windowsMini'
    | 'windowMax'
    | 'windowClose'
    | 'checkUpdate'
    | 'confirmUpdate'
    | 'appClose'
    | 'openMessageBox'
    | 'openErrorBox'
    | 'hotUpdate'
    | 'openDevtools'
    | 'devtoolsStatus'
    | 'openWeb'
    | 'openWin'
    | 'startDownload'
    | 'getDownloadConfig'
    | 'userLogin'
