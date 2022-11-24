
/**
 * 聊天室的接口类
 */
interface room {

    /**
     * 链接到聊天室
     */
    connect(): void;

    /**
     * 收到聊天室消息
     * @param data 消息体
     */
    receiveMsg(data: Buffer): String;

    /**
     * 链接到聊天室
     */
    close(): void;

}
