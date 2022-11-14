// 这里是定义菜单的地方，详情请查看 https://electronjs.org/docs/api/menu
import {app, dialog} from 'electron'
import {arch, release, type} from 'os'
import packageInfo from '../../../package.json'
interface MenuState {
    label:string,
    submenu: any,
}
const menu:Array<MenuState> = [
    {
        label: '设置',
        submenu: [{
            label: '快速重启',
            accelerator: 'CmdOrCtrl+R',
            role: 'reload'
        }, {
            label: '退出',
            accelerator: 'CmdOrCtrl+F4',
            role: 'close'
        }]
    },
    {
        label: "编辑",
        submenu: [
            {label: "复制", accelerator: "CmdOrCtrl+C", selector: "copy:"},
            {label: "粘贴", accelerator: "CmdOrCtrl+V", selector: "paste:"},
        ]
    }
]

if (process.platform === 'darwin') {
    menu.unshift(
        {
            label: app.getName(),
            submenu: [{
                label: '关于',
                accelerator: 'CmdOrCtrl+Q',
                click: function () {
                    info()
                }
            }]
        });
}

function info() {
    dialog.showMessageBox({
        title: '关于',
        type: 'info',
        message: 'electron-Vue框架',
        detail: `版本信息：${packageInfo.version}\n引擎版本：${process.versions.v8}\n当前系统：${type()} ${arch()} ${release()}`,
        noLink: true,
        buttons: ['确定']
    }).then(r => {
        console.log('123')
    })
}

export default menu
