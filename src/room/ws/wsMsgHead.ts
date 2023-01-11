import { operationType } from './enum/operationType'
import { bodyFormatType } from './enum/bodyFormatType'

class wsMsgHead {
    private totalLength!: number;
    private headLength: number;
    private formatType: bodyFormatType;
    private operation: operationType;
    private data: string;

    constructor(formatType: bodyFormatType, operation: operationType, data: string) {
        if (data.length <= 0) {
            throw new Error("sand data CAN NOT be empty!");
        }

        this.formatType = formatType;
        this.operation = operation;
        this.data = data;
        this.headLength = 16;
        this.totalLength = this.headLength + this.data.length;
    }

    public pack(): wsMsgHead {
        this.totalLength = this.headLength + this.data.length;

        const dataBuf: Buffer = Buffer.from(this.data);
        const headBuf = Int32Array.from([this.totalLength]);
        const array = new Float32Array(5);


        return this;
    }


    public parse(): string {
        
        return '';
    }

    public format(len: number, pad: number): Array<number> {
        const str = len.toString(16).padStart(pad, '0');

        return new Array();
    }

}
