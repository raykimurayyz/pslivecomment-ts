
/**
 * 消息的类型
 */
export const enum OperationType {
    // 客户端发送的心跳包(30秒发送一次)
    HEART_BEAT_REQ = 2,
    // 服务器收到心跳包的回复
    HEART_BEAT_RESP = 3,
    // 服务器推送的弹幕消息包
    NOTICE_LISTEN_RESP = 5,
    // 客户端发送的鉴权包(客户端发送的第一个包)
    FOLLOW_CHANNEL_REQ = 7,
    // 服务器收到鉴权包后的回复
    FOLLOW_CHANNEL_RESP = 8,
}
