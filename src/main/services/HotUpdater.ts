/**
 * power by biuuu
 */

import {copy, createWriteStream, emptyDir, readFile, remove} from 'fs-extra'
import {join, resolve} from 'path'
import {promisify} from 'util'
import {pipeline} from 'stream'
import {app, BrowserWindow} from 'electron'
import {gt} from 'semver'
import {createHmac} from 'crypto'
import extract from 'extract-zip'
import {version} from '../../../package.json'
import {hotPublishConfig} from '../config/hotPublish'
import axios, {AxiosResponse} from 'axios'

const streamPipeline = promisify(pipeline)
const appPath = app.getAppPath()
const updatePath = resolve(appPath, '..', '..', 'update')
const request = axios.create()

/**
 * @param data 文件流
 * @param type 类型，默认sha256
 * @param key 密钥，用于匹配计算结果
 * @returns {string} 计算结果
 * @author umbrella22
 * @date 2021-03-05
 */
function hash(data, type = 'sha256', key = 'Sky'): string {
    const hmac = createHmac(type, key)
    hmac.update(data)
    return hmac.digest('hex')
}


/**
 * @param url 下载地址
 * @param filePath 文件存放地址
 * @returns {void}
 * @author umbrella22
 * @date 2021-03-05
 */
async function download(url: string, filePath: string): Promise<void> {
    const res = await request({url, responseType: "stream"})
    await streamPipeline(res.data, createWriteStream(filePath))
}

const updateInfo = {
    status: 'init',
    message: ''
}

interface Res extends AxiosResponse<any> {
    data: {
        version?: string;
        name?: string;
        hash?: string;
    };
}

/**
 * @param windows 指主窗口
 * @returns {void}
 * @author umbrella22
 * @date 2021-03-05
 */
export const updater = async (windows?: BrowserWindow): Promise<void> => {
    try {
        const res: Res = await request({url: `${hotPublishConfig.url}/${hotPublishConfig.configName}.json?time=${new Date().getTime()}`,})
        if (gt(res.data.version, version)) {
            await emptyDir(updatePath)
            const filePath = join(updatePath, res.data.name)
            updateInfo.status = 'downloading'
            if (windows) windows.webContents.send('hot-update-status', updateInfo);
            await download(`${hotPublishConfig.url}/${res.data.name}`, filePath);
            const buffer = await readFile(filePath)
            const sha256 = hash(buffer)
            if (sha256 !== res.data.hash) throw new Error('sha256 error')
            const appPathTemp = join(updatePath, 'temp')
            await extract(filePath, {dir: appPathTemp})
            updateInfo.status = 'moving'
            if (windows) windows.webContents.send('hot-update-status', updateInfo);
            await remove(join(`${appPath}`, 'dist'));
            await remove(join(`${appPath}`, 'package.json'));
            await copy(appPathTemp, appPath)
            updateInfo.status = 'finished'
            if (windows) windows.webContents.send('hot-update-status', updateInfo);
        }


    } catch (error) {
        updateInfo.status = 'failed'
        updateInfo.message = error
        if (windows) windows.webContents.send('hot-update-status', updateInfo)
    }
}

export const getUpdateInfo = () => updateInfo