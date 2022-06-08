import logger from 'electron-log'
import {app} from 'electron'

logger.transports.file.level = 'debug'

logger.transports.file.level = 'debug'
logger.transports.file.maxSize = 1002430 // 10M
logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
let date = new Date()
let dateStr: string = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
logger.transports.file.fileName = '\\electron_log\\app\\' + dateStr + '.log'
export default {
    info: (message) => {
        logger.info(message)
    }
}