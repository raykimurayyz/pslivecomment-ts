import { Socket } from 'net'

class twitchEmulator {
    private tid: String;
    private pinger: any = -1;

    constructor(tid: String) {
        this.tid = tid;
    }

    set setPinger(p: any) {
        this.pinger = p;
    }

    public close(): void {
        clearInterval(this.pinger);
        console.log("emulator closed");
    }

    public toPS4(name: String, message: String, sock: Socket): void {
        try {
            sock.write(":" + name + "!" + name + "@" + name + ".tmi.twitch.tv PRIVMSG #" + name + " :" + message + "\r\n");
        } catch (e) {
            console.error(`resp ps failed. ${e}`);
        }
    }

    public sendHandshake(sock: Socket): void {
        try {
            sock.write(":tmi.twitch.tv 001 " + this.tid + " :Welcome, GLHF!\r\n");
            sock.write(":tmi.twitch.tv 002 " + this.tid + " :Your host is tmi.twitch.tv\r\n");
            sock.write(":tmi.twitch.tv 003 " + this.tid + " :This server is rather new\r\n");
            sock.write(":tmi.twitch.tv 004 " + this.tid + " :-\r\n");
            sock.write(":tmi.twitch.tv 375 " + this.tid + " :-\r\n");
            sock.write(":tmi.twitch.tv 372 " + this.tid + " :You are in a maze of twisty passages, all alike.\r\n");
            sock.write(":tmi.twitch.tv 376 " + this.tid + " :>\r\n");
            sock.write("\r\n");
            console.log("handshake sent to ps4");
        } catch (e) {
            console.log("handshake sent faild.");
        }
    }

    public sendPing(sock: Socket): void {
        try {
            sock.write("PING :tmi.twitch.tv\r\n");
            console.log("sent a PING to client.");
        } catch (e) {
            console.log("failed to send ping.");
        }
    }

    /**
     * 
     * @param sock 
     */
    public sendCAP(sock: Socket): void {
        try {
            sock.write(":tmi.twitch.tv CAP * ACK :twitch.tv/tags\r\n");
        } catch (e) {
            console.log("failed to send cap.");
        }
    }

}

export { twitchEmulator };
