
function say(word: String): void {
    console.log(word);
}

interface PlatformService {
    listen: Function,
    send: Function,
    receive: Function
}

export { say, PlatformService };