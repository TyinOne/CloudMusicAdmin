import App = Electron.App;
import store from "@main/services/store";
import {IDownloadConfig} from "@main/services/interface/model/IDownloadConfig";

export class UserManager {
    public downloadConfig: string
    constructor() {
    };

    init(app:App, args:any) {
        let oldConfig = store.get('downloadConfig');
        // @ts-ignore
        if (!oldConfig.path) {
            this.downloadConfig = `${app.getPath('userData')}\\${args.userAccount}\\downloads\\`;
            let config: IDownloadConfig = {
                path: this.downloadConfig
            }
            store.set("downloadConfig", config)
        }
    }
}