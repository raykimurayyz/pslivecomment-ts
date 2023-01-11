
/**
 * 操作类型
 */
enum operationType {
    // 心跳包操作-请求
    HEART_BEAT_REQ = 2,
    // 心跳包操作-应答
    HEART_BEAT_RESP = 3,
    // 消息操作-接收
    NOTICE_LISTEN_RESP = 5,
    // 订阅频道操作-请求
    FOLLOW_CHANNEL_REQ = 7,
    // 订阅频道操作-应答
    FOLLOW_CHANNEL_RESP = 8,
}

export { operationType }