import { ircListener } from './ircListener'
import { twitchEmulator } from './twitchEmulator'

// log exception info
process.on('uncaughtException', console.log);

// start listening
new ircListener()
    .create(new twitchEmulator("21540998"))
    .listen();
