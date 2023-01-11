
/**
 * 聊天室的接口类
 */
interface Room {

    /**
     * 链接到聊天室
     */
    connect(): void;

    /**
     * 收到聊天室消息
     * @param data 消息体
     */
    receiveMsg(data: Buffer): string;

    /**
     * 链接到聊天室
     */
    close(): void;

}

export default Room