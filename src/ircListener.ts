import { Server, createServer } from 'net'
import { twitchEmulator } from './twitchEmulator'

class ircListener {
    private _host: String;
    private _port: number;
    private sockServer!: Server;

    constructor(port: number = 6667, host: String = "0.0.0.0") {
        this._port = port;
        this._host = host;
    }

    public set port(port: number) {
        this._port = port;
    }

    public create(emulator: twitchEmulator): Server {
        this.sockServer = createServer((sock) => {
            console.log("create server");
            sock.on("data", (respData) => {
                const message = respData.toString();
                console.log("Console said: " + message);
                if (message.startsWith("CAP REQ")) {
                    emulator.sendCAP(sock);
                }
                if (message.startsWith("NICK") || message.startsWith(" PASS")) {
                    emulator.sendHandshake(sock);
                }
            });
            sock.on("close", emulator.close);
            const _handler = setInterval(() => emulator.sendPing(sock), 15 * 1000);
            emulator.setPinger(_handler);
        });
        return this.sockServer;
    }

    public listen(): void {
        if (this.sockServer instanceof Server) {
            this.sockServer.listen(this._host, this._port);
            console.log("irc server start");
        } else {
            console.error("listen server is incorrect!");
        }
    }

}

export { ircListener }