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
    BuiltInServerPort: 8888,
    hotUpdate: {
        hotPublishHost: "http://127.0.0.1:8888",
        hotPublishCheck: "admin/update/check",
    }
}