import IrcListener from './ircListener'
import logger from './util/logger'
import TestIrc from './test'
import BilibiliChatHandler from './room/bilibiliChatHandler';
import DouyuChatHandler from './room/douyuChatHandler';

// log exception info
process.on('uncaughtException', logger.error);

// 读配置文件
let roomProperties: any = {};
require("properties")
    .parse("resource/application.properties",
        { path: true },
        async (error: any, obj: any) => {
            if (error) {
                logger.error(error);
                return;
            }
            roomProperties = obj
            logger.info(obj)
        }
    );

new Promise<IrcListener>((resolve) => {
    // 启动IRC监听服务
    const listerner = new IrcListener().listen()
    resolve(listerner)
}).then(listener => {
    // IRC监听绑定斗鱼
    const { douyuRoomNo } = roomProperties
    // listener.bindChatHandler(new DouyuChatHandler(douyuRoomNo));
    return listener
}).then(listener => {
    // IRC监听绑定哔哩哔哩
    const { bilibiliRoomNo } = roomProperties
    listener.bindChatHandler(new BilibiliChatHandler(bilibiliRoomNo));
    return listener
}).then(() => {
    // 测试程序
    // new TestIrc()
}).catch(err => {
    logger.error(err);
});
