
import { VersionType } from "./enum/versionType"
import { OperationType } from "./enum/operationType"
import { pack, packString } from 'byte-data'

/**
 * 接收到的消息对象
 */
export class message {
    // 操作类型
    private cmd!: string;
    // 数据对象
    private data!: messageData;
    // 消息数组
    private info!: Array<string>;
}

export class messageData {
    // 用户名称
    private uname!: string;
    // 礼物名称
    private giftName!: string;
}

const BIT_LENGTH: number = 8;

export class websocketMessage {
    // 整个包的长度(包含header头)
    private packageLength!: number;
    // Header长度，固定16
    private headLength: number = 16;
    // 是否压缩
    private version: VersionType;
    // 消息类型
    private operation: OperationType;
    // 序号id，预留字段
    private sequenceId: number = 0;
    // 消息题
    private body!: string;

    /**
     * 构造函数
     * 
     * @param operation OperationType类型的operation参数，表示操作类型用于初始化operation属性
     * @param body 字符串类型的body参数，表示操作的具体内容，用于初始化body属性
     * @param version VersionType类型的version参数，表示消息压缩类型，默认为不压缩
     */
    constructor(operation: OperationType, body: string, version: VersionType = VersionType.DIRECT) {
        this.operation = operation;
        this.body = body;
        this.version = version;
    }

    public packFullMessage(): Buffer {
        // 打包各个字段的内容
        const byteHeader = pack(16, { bits: BIT_LENGTH * 2 });
        const byteVersion = pack(this.version, { bits: BIT_LENGTH * 2 });
        const byteOperation = pack(this.operation, { bits: BIT_LENGTH * 4 });
        const byteSequenceId = pack(this.sequenceId, { bits: BIT_LENGTH * 4 });
        const byteBody = packString(this.body);

        // 计算上述字段的长度
        const packageLength = byteHeader.length + byteVersion.length + byteOperation.length + byteSequenceId.length + byteBody.length;
        const bytePackageLength = pack(packageLength, { bits: BIT_LENGTH * 4 });

        return Buffer.alloc(0);
    }
}