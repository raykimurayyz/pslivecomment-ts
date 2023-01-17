import IrcListener from './irc.listener'
import logger from './tool/logger'
import TestIrc from './test'

// log exception info
process.on('uncaughtException', logger.error);

// read properties
new Promise((resolve, reject) => {
    const properties = require("properties");
    properties.parse("resource/application.properties",
        { path: true },
        (error: any, obj: any) => {
            if (error) {
                reject(error)
            }
            logger.info(obj)
            const { bilibiliRoomNo } = obj
            if (bilibiliRoomNo !== null) {
                resolve(bilibiliRoomNo);
            } else {
                reject('roomId is empty!')
            }
        }
    );
})
    .then((ret: any) => {
        new IrcListener()
            .create(ret)
            .listen()
    })
    .then(() => {
        // new TestIrc();
    })
    .catch(err => {
        logger.error(err);
    });
