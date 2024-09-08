import { Socket } from 'net'
import logger from './util/logger'

export default class TestIrc {

    constructor() {
        const client = new Socket();
        client.connect(6667, '127.0.0.1', () => {
            logger.info('client Connected');
            client.write('Hello, server! Love, Client.');
        }).on("data", msg => { logger.info(msg) });
    }

    public connect() {
        logger.info('client connecting');
    }
}
