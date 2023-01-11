import { Socket } from 'net'
import logger from './tool/logger'

class TestIrc {

    constructor() {
        const client = new Socket();
        client.connect(6667, '127.0.0.1', function () {
            logger.info('client Connected');
            client.write('Hello, server! Love, Client.');
        });
    }

    public connect() {
        logger.info('client connecting');
    }
}

export default TestIrc