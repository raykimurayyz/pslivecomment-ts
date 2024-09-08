
/**
 * 收到消息的类型
 */
export const enum CmdType {
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
    // 获取弹幕信息
    OPEN_LIVEROOM_DM = "OPEN_LIVEROOM_DM",
    // 获取礼物信息
    OPEN_LIVEROOM_SEND_GIFT = "OPEN_LIVEROOM_SEND_GIFT",
    // 获取付费留言
    OPEN_LIVEROOM_SUPER_CHAT = "OPEN_LIVEROOM_SUPER_CHAT",
    // 付费留言下线
    OPEN_LIVEROOM_SUPER_CHAT_DEL = "OPEN_LIVEROOM_SUPER_CHAT_DEL",
    // 付费大航海
    OPEN_LIVEROOM_GUARD = "OPEN_LIVEROOM_GUARD",
    // 点赞信息
    OPEN_LIVEROOM_LIKE = "OPEN_LIVEROOM_LIKE",
}
