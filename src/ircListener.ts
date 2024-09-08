import { Server, createServer } from 'net'
import logger from './util/logger'
import TwitchEmulator from './twitchEmulator'
import RoomBilibili from './room/room-bilibili'
import ChatHandler from './room/chatHandler';

/**
 * IRC聊天室监听服务
 */
export default class IrcListener {
    /**
     * 监听端口
     */
    private _port: number;
    /**
     * twitch模拟器
     */
    private emulator!: TwitchEmulator;

    /**
     * 构造函数
     * @param port 监听端口，默认6667
     */
    constructor(port: number = 6667) {
        this._port = port;
    }

    /**
     * 创建监听
     */
    public listen = (): IrcListener => {
        createServer(async (sock) => {
            logger.info("create server");
            this.emulator = new TwitchEmulator(sock);
            sock.on("data", (respData) => {
                const message = respData.toString();
                logger.info("logger said: " + message);
                if (message.startsWith("CAP REQ")) {
                    this.emulator.sendCAP();
                }
                if (message.startsWith("NICK") || message.startsWith(" PASS")) {
                    this.emulator.sendHandshake();
                }
            });
            sock.on("close", this.emulator.close);
            const _handler = setInterval(() => this.emulator.sendPing(), 15 * 1000);
            this.emulator.setPinger(_handler);
        }).listen(this._port);

        logger.info("irc server start");
        return this;
    }

    public bindChatHandler = (handler: ChatHandler): void => {
        handler.bindTwitchEmulator(this.emulator);
    }

}
