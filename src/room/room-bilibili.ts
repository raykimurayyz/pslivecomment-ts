import { Socket, connect } from "net";
import { inflate } from "zlib";
import logger from '../tool/logger'
import TwitchEmulator from "../twitch-emulator";
import Room from './room'

/**
 * bilibili聊天室的实现类
 */
class RoomBilibili implements Room {

    private uid: number = new Date().getTime();
    private rid: string;
    private sock!: Socket;
    private emulator: TwitchEmulator;
    private interval!: NodeJS.Timer;
    private buf!: Buffer | null;

    constructor(rid: string, emulator: TwitchEmulator) {
        this.rid = rid;
        this.emulator = emulator;
        this.sock = connect(2243, "chat.bilibili.com")
            .on("connect", this.connect)
            .on("data", this.receiveMsg);
        // this.heartBeat();
    }

    public connect = (): void => {
        logger.info("connected bilibili success");
        this.heartBeat();
    }

    public receiveMsg = (data: Buffer): string => {
        try {
            this.popBilibiliMsg(data, (msg: any) => {
                let relpyMsg: string = "";
                let title: string = "";
                let message: string = "";
                logger.info(`msg.cmd: ${msg.cmd}`);
                switch (msg.cmd) {
                    case "DANMU_MSG":
                        title = msg.info[2][1];
                        message = msg.info[1];
                        relpyMsg = `${msg.info[2][1]}: ${msg.info[1]}`;
                        this.emulator.toPS4(title, message);
                        break;
                    case "SEND_GIFT":
                        title = `${msg.data.uname}送出礼物: `;
                        message = msg.data.giftName;
                        relpyMsg = `${msg.data.uname}送出礼物√${msg.data.giftName}`;
                        this.emulator.toPS4(title, message);
                        break;
                    case "WELCOME":
                        title = msg.data.uanme;
                        message = '进入直播间';
                        relpyMsg = `${msg.data.uanme}进入直播间`;
                        this.emulator.toPS4(title, message);
                        break;
                    default:
                        break;
                }
                if (relpyMsg.length > 0) {
                    logger.info(`relpy msg to PlayStation: ${relpyMsg}`);
                }
            });
            return "";
        } catch (error) {
            logger.error("close bilibili");
            throw error;
        }
    }

    public close(): void {
        try {
            clearInterval(this.interval);
            this.sock.destroy();
            logger.error("close bilibili");
        } catch (err) {
            logger.error(`close bilibili error!: ${err}`);
            throw err;
        }
    }

    public heartBeat = (): void => {
        try {
            const dataBuffer = Buffer.from(`{"roomid":${this.rid},"uid":${this.uid}}`);
            const headerBuffer = Buffer.from([0, 0, 0, dataBuffer.length + 16, 0, 16, 0, 1, 0, 0, 0, 7, 0, 0, 0, 1]);
            const heartBeat = Buffer.from([0, 0, 0, 16, 0, 16, 0, 1, 0, 0, 0, 2, 0, 0, 0, 1]);
            let packageBuffer = Buffer.alloc(dataBuffer.length + headerBuffer.length);
            packageBuffer = Buffer.concat([headerBuffer, dataBuffer]);
            this.sock.write(packageBuffer, () => {
                this.interval = setInterval(() => {
                    this.sock.write(heartBeat);
                    logger.info("bilibil heartbeat");
                }, 30 * 1000);
            });
        } catch (err) {
            logger.error("heartBeat bilibili failed");
            throw err;
        }
    }

    private popBilibiliMsg = (d: Buffer, callback: Function): void => {
        if (this.buf) {
            d = Buffer.concat([this.buf, d]);
        }
        const version = d[6] << 8 | d[7];
        const action = d[8] | d[9] | d[10] | d[11];
        logger.info(`version: ${version}, action: ${action}`);
        if (callback && d[11] != 3 && d[11] != 8) {
            const length = d[0] * 256 * 256 * 256 + d[1] * 256 * 256 + d[2] * 256 + d[3];
            // resolve bilibili TCP-nagle bug
            if (version != 2) {
                if (d.length == length) {
                    this.buf = null;
                    callback(JSON.parse(d.subarray(16).toString()));
                } else if (d.length > length) {
                    this.buf = null;
                    callback(JSON.parse(d.subarray(16, length).toString()));
                    this.popBilibiliMsg(d.subarray(length), callback);
                } else {
                    this.buf = d;
                }
            } else if (action == 5) {
                inflate(d.subarray(16), (er4, newD) => {
                    if (er4) {
                        logger.info(er4);
                    } else {
                        const _msg = newD.toString().slice(16);
                        //logger.info(_msg);
                        const sta = [];
                        let tmpSentence = "";
                        let reloop = true;
                        for (let index = 0; index < _msg.length; index++) {
                            if (_msg[index] == '{') {
                                reloop = false;
                                sta.push("{");
                                tmpSentence = tmpSentence + _msg[index];
                            } else if (_msg[index] == '}') {
                                sta.pop();
                                tmpSentence = tmpSentence + _msg[index];
                            } else {
                                if (sta.length == 0) {
                                    //ignore
                                } else {
                                    tmpSentence = tmpSentence + _msg[index];
                                }
                            }
                            if (sta.length == 0 && !reloop) {
                                callback(JSON.parse(tmpSentence));
                                tmpSentence = "";
                                reloop = true;
                            }
                        }
                    }
                });
            }
        }
    }
}

export default RoomBilibili