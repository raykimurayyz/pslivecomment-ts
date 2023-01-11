import { Socket } from 'net'
import logger from './tool/logger'

class TwitchEmulator {
    private tid: string = '1234567';
    private pinger: any = -1;
    private sock: Socket;

    constructor(s: Socket) {
        this.sock = s;
    }

    public setPinger(p: any): void {
        this.pinger = p;
    }

    public close(): void {
        clearInterval(this.pinger);
        logger.info("emulator closed");
    }

    public toPS4(name: string, message: string): void {
        try {
            this.sock.write(`:${name}!${name}@${name}.tmi.twitch.tv PRIVMSG #${name} :${message}\r\n`);
        } catch (e) {
            logger.error(`resp ps failed. ${e}`);
        }
    }

    public sendHandshake(): void {
        try {
            this.sock.write(":tmi.twitch.tv 001 " + this.tid + " :Welcome, GLHF!\r\n");
            this.sock.write(":tmi.twitch.tv 002 " + this.tid + " :Your host is tmi.twitch.tv\r\n");
            this.sock.write(":tmi.twitch.tv 003 " + this.tid + " :This server is rather new\r\n");
            this.sock.write(":tmi.twitch.tv 004 " + this.tid + " :-\r\n");
            this.sock.write(":tmi.twitch.tv 375 " + this.tid + " :-\r\n");
            this.sock.write(":tmi.twitch.tv 372 " + this.tid + " :You are in a maze of twisty passages, all alike.\r\n");
            this.sock.write(":tmi.twitch.tv 376 " + this.tid + " :>\r\n");
            this.sock.write("\r\n");
            logger.info("handshake sent to PlayStation.");
        } catch (e) {
            logger.error("handshake sent faild.");
        }
    }

    public sendPing(): void {
        try {
            this.sock.write("PING :tmi.twitch.tv\r\n");
            logger.info("sent a PING to client.");
        } catch (e) {
            logger.error("failed to send ping.");
        }
    }

    /**
     * 应答CAP请求
     * @param sock 
     */
    public sendCAP(): void {
        try {
            this.sock.write(":tmi.twitch.tv CAP * ACK :twitch.tv/tags\r\n");
        } catch (e) {
            logger.error("failed to send cap.");
        }
    }

}

export default TwitchEmulator;
