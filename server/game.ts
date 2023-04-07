import { Notifier } from "server/notifier";
import { ServerUser } from "server/user";
import { fork, ChildProcess } from "child_process";

export class Player {
    constructor(public user: ServerUser) { }
}

const INFO_REQUEST_MESSAGE = 'info_request'

export class Game<GameInfo extends Record<string, any> = any> extends Notifier<GameInfo> {
    static limitation = {
        min: 1,
        max: 10
    }

    private _onEnd: () => void
    protected players: Player[]
    constructor(args: { players: ServerUser[] }) {
        super()
        this.players = args.players.map((u) => new Player(u))
    }

    start() { }
    next(uuid: string, ...args: any[]) { }


    getPersonalInfo(uuid: string): GameInfo {
        return { [uuid]: undefined } as GameInfo
    }
    protected end() {
        this._onEnd()
    }
    onEnd(fn: () => void) {
        this._onEnd = fn
    }
}

// const serialize = (args: ConstructorParameters<typeof Game>) => {
//     return ['']
// }
// export type GameMessage = {
//     type: 'init'
// }
// process.on('message', e => { })

// export class ForkedGame extends Game {
//     forked: ChildProcess
//     constructor(path: string, ...args: ConstructorParameters<typeof Game>) {
//         super(...args)
//         this.forked = fork(path, serialize(args))
//     }
// }