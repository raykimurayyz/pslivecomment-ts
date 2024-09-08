import TwitchEmulator from "../twitchEmulator";

/**
 * 聊天室抽象接口
 */
export default interface ChatHandler {
    /**
     * 链接到聊天室
     */
    connect(): void;

    /**
     * 绑定到模拟器
     * @param emulator 模拟器
     */
    bindTwitchEmulator(emulator: TwitchEmulator): void;

    /**
     * 链接到聊天室
     */
    close(): void;
}