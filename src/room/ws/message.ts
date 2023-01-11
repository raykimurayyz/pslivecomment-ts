
/**
 * 接收到的消息对象
 */
class message {
    // 操作类型
    private cmd!: string;
    // 数据对象
    private data!: messageData;
    // 消息数组
    private info!: Array<string>;
}

class messageData {
    // 用户名称
    private uname!: string;
    // 礼物名称
    private giftName!: string;
}
