import {hotUpdate} from '@config/index.js'

interface hotPublishConfig {
    hotPublishHost: string,
    hotPublishCheck: string,
}
export const hotPublishConfig: hotPublishConfig = {
    hotPublishHost: hotUpdate.hotPublishHost,
    hotPublishCheck: hotUpdate.hotPublishCheck
}