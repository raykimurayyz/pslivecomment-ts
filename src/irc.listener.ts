import { Server, createServer } from 'net'
import logger from './tool/logger'
import TwitchEmulator from './twitch-emulator'
import RoomBilibili from './room/room-bilibili'

/**
 * IRC监听服务对象
 */
class IrcListener {
    /**
     * 监听端口，默认6667
     */
    private _port: number;
    /**
     * socket监听服务
     */
    private sockServer!: Server;
    /**
     * twitch模拟器
     */
    private emulator!: TwitchEmulator;
    /**
     * 房间
     */
    private room!: RoomBilibili;

    /**
     * 构造函数
     * @param port 监听端口
     */
    constructor(port: number = 6667) {
        this._port = port;
    }

    /**
     * 创建监听
     */
    public create = (roomId: string): IrcListener => {
        this.sockServer = createServer(async (sock) => {
            logger.info("create server");
            this.emulator = new TwitchEmulator(sock);
            this.room = new RoomBilibili(roomId, this.emulator);
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
        });

        return this;
    }


    public openRoom(roomId: string): IrcListener {
        this.room = new RoomBilibili(roomId, this.emulator);
        return this;
    }
    /**
     * 启动监听irc服务
     */
    public listen(): void {
        if (this.sockServer instanceof Server) {
            this.sockServer.listen(this._port);
            logger.info("irc server start");
        } else {
            logger.error("listen server is incorrect!");
        }
    }

}

export default IrcListener 