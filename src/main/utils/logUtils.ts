import logger from 'electron-log'
import {app} from 'electron'

logger.transports.file.level = 'debug'

logger.transports.file.level = 'debug'
logger.transports.file.maxSize = 1002430 // 10M
logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
let date = new Date()
date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
logger.transports.file.fileName = '\\electron_log\\app\\' + date + '.log'
export default {
    info: (message) => {
        logger.info(message)
    }
}