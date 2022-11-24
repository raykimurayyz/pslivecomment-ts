
/**
 * 收到消息的类型
 */
enum cmdType {
    // 弹幕消息
    DANMU_MSG = "DANMU_MSG",
    // 送出礼物
    SEND_GIFT = "SEND_GIFT",
    // 欢迎进入
    WELCOME = "WELCOME",
    // 频道停播，其他频道列表
    STOP_LIVE_ROOM_LIST = "STOP_LIVE_ROOM_LIST",
    // 通知消息
    NOTICE_MSG = "NOTICE_MSG",
}

export { cmdType }