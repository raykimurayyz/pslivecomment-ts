
import WebSocket from 'ws';

import logger from '../util/logger'
import TwitchEmulator from '../twitchEmulator';
import ChatHandler from './chatHandler';

const HEARTBEAT_INTERVAL = 45000; // 45秒

export default class DouyuChatHandler implements ChatHandler {
    private ws!: WebSocket;
    private emulator!: TwitchEmulator;
    // 斗鱼房间ID
    private roomID: string;
    private heartbeatInterval!: NodeJS.Timeout;

    constructor(roomID: string) {
        this.roomID = roomID;
        this.connect()
    }

    bindTwitchEmulator(emulator: TwitchEmulator): void {
        this.emulator = emulator;
    }

    connect() {
        this.ws = new WebSocket(`wss://danmuproxy.douyu.com:8506/`);
        this.ws
            .on('open', () => {
                this.sendJoinRoom();
                this.startHeartbeat();
                logger.info('已连接到斗鱼聊天服务器');
            })
            .on('message', (data: WebSocket.Data) => {
                this.handleMessage(data);
            })
            .on('close', () => {
                this.stopHeartbeat();
                logger.info('已断开与斗鱼聊天服务器的连接');
            })
            .on('error', (error) => {
                logger.error('斗鱼弹幕服务器连接错误:', error);
                this.reconnect();
            });
    }

    close(): void {
        throw new Error('Method not implemented.');
    }

    private reconnect() {
        setTimeout(() => this.connect(), 5000);
    }

    private sendJoinRoom() {
        // 加入房间的消息
        const joinRoomMsg = `type@=loginreq/roomid@=${this.roomID}/\0type@=joingroup/rid@=${this.roomID}/gid@=-9999/\0`;
        this.ws.send(joinRoomMsg);
    }

    private startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            const heartbeatMsg = `type@=mrkl/\0`;
            this.ws.send(heartbeatMsg);
            logger.info('发送心跳消息');
        }, HEARTBEAT_INTERVAL);
    }

    private stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
    }

    private handleMessage(data: WebSocket.Data) {
        logger.info('收到斗鱼聊天消息:', data);

        // 假设数据是Buffer类型，需要解码
        const decodedData = data.toString();
        const messages = decodedData.split('\0').filter(Boolean);

        for (const msg of messages) {
            if (msg.includes('type@=chatmsg')) {
                const chatMsg = this.parseMessage(msg);
                logger.info('收到聊天消息:', chatMsg);
                // 将聊天消息重定向到PlayStation
                this.emulator.toPS4("斗鱼用户", chatMsg);
            }
        }
    }

    /**
     * 解析斗鱼聊天消息
     * @param message 斗鱼聊天消息
     * @returns 解析后的消息对象
     */
    private parseMessage(message: string) {
        const msgObj: any = {};
        const items = message.split('/');
        items.forEach((item) => {
            const [key, value] = item.split('@=');
            if (key && value) {
                msgObj[key] = value;
            }
        });
        return msgObj;
    }

}