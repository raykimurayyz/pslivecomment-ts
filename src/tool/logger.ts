import log4js from "log4js"

log4js.configure({
    appenders: {
        out: {
            type: "stdout",
            layout: {
                type: "pattern",
                pattern: "[%d{yyyy-MM-dd hh:mm:ss}] [%[%p%]] [%f{1}:%l] --- %m",
            },
        },
    },
    categories: { default: { appenders: ["out"], level: "info", enableCallStack: true } },
})
const logger = log4js.getLogger()
logger.level = 'info'

// const logger = {
//     info: (...args: any) => {
//         console.log(...args)
//     },
//     error: (...args: any) => {
//         console.error(...args)
//     }
// }

export default logger

