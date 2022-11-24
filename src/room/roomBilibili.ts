import { Socket } from "net";
import net from "net";
import { inflate } from "zlib";

/**
 * bilibili聊天室的实现类
 */
class roomBilibili implements room {

    private uid: number = 123456789012345 + 1000000000000000 * Math.random()
    private rid: String;
    private sock!: Socket;
    private interval!: NodeJS.Timer;
    private buf!: Buffer | null;

    constructor(rid: String) {
        this.rid = rid;
        this.connect();
        this.sock.on("data",this.receiveMsg);
        this.sock.on("close",this.close);
    }

    public connect(): void {
        try {
            this.sock = net.connect(2243, "chat.bilibili.com");
            console.log("connected to bilibili");
        } catch (err) {
            console.error("connect bilibili failed");
            throw err;
        }
    }
    public receiveMsg(data: Buffer): String {
        try {
            this.popBilibiliMsg(data, (msg: any) => {
                let relpyMsg: String = "";
                switch (msg.cmd) {
                    case "DANMU_MSG":
                        relpyMsg = `${msg.info[2][1]}": "${msg.info[1]}`;
                        break;
                    case "SEND_GIFT":
                        relpyMsg = `${msg.data.uname}送出礼物√${msg.data.giftName}`;
                        break;
                    case "WELCOME":
                        relpyMsg = `${msg.data.uanme}进入直播间`;
                        break;
                    default:
                        break;
                }
                console.log(`relpyMsg to ps: ${relpyMsg}`);
                return relpyMsg;
            });
            return "";
        } catch (error) {
            console.error("close bilibili");
            throw error;
        }
    }
    public close(): void {
        try {
            clearInterval(this.interval);
            this.sock.destroy();
        } catch (err) {
            console.error("close bilibili");
            throw err;
        }
    }
    public heartBeat(): void {
        try {
            const dataBuffer = Buffer.from(`{"roomid":"${this.rid}","uid":"${this.uid}"}`);
            const headerBuffer = Buffer.from([0, 0, 0, dataBuffer.length + 16, 0, 16, 0, 1, 0, 0, 0, 7, 0, 0, 0, 1]);
            const heartBeat = Buffer.from([0, 0, 0, 16, 0, 16, 0, 1, 0, 0, 0, 2, 0, 0, 0, 1]);
            let packageBuffer = Buffer.alloc(dataBuffer.length + headerBuffer.length);
            packageBuffer = Buffer.concat([headerBuffer, dataBuffer]);
            this.sock.write(packageBuffer, () => {
                this.interval = setInterval(() => {
                    this.sock.write(heartBeat);
                    console.log("heartbeat");
                }, 30 * 1000);
            });
        } catch (err) {
            console.error("heartBeat bilibili failed");
            throw err;
        }
    }

    private popBilibiliMsg(d: Buffer, callback: Function) {
        if (this.buf) {
            d = Buffer.concat([this.buf, d]);
        }
        const version = d[6] << 8 | d[7];
        const action = d[8] | d[9] | d[10] | d[11];
        console.log(action);
        if (callback && d[11] != 3 && d[11] != 8) {
            const length = d[0] * 256 * 256 * 256 + d[1] * 256 * 256 + d[2] * 256 + d[3];
            // resolve bilibili TCP-nagle bug
            console.log(version);
            console.log("action:" + action);
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
            } else {
                if (action == 5) {
                    inflate(d.subarray(16), (er4, newD) => {
                        if (er4) {
                            console.log(er4);
                        } else {
                            const _msg = newD.toString().slice(16);
                            //console.log(_msg);
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
                                    //console.log("#"+tmpSentence);
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
}