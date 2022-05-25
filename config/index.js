module.exports = {
    build: {
        DisableF12: true,
        env: require('./prod.env'),
    },
    dev: {
        env: require('./dev.env'),
        removeElectronJunk: true,
        chineseLog: false,
        port: 9080,
    },
    DllFolder: '',
    HotUpdateFolder: 'update',
    UseStartupChart: true,
    IsUseSysTitle: false,
    hotUpdate: {
        hotPublishHost: "https://api.tyin.vip",
        hotPublishCheck: "admin/update/check",
    }
}