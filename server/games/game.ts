import { Notifier } from "server/notifier";
import { ServerUser } from "server/user";

export class Player {
    constructor(public user: ServerUser) { }
}

export class Game<GameInfo extends Record<string, any> = any> extends Notifier<GameInfo> {
    static limitation = {
        min: 1,
        max: 10
    }

    private _onEnd: () => void
    protected players: Player[]
    constructor(args: { onEnd: () => void, players: ServerUser[] }) {
        super()
        this._onEnd = args.onEnd
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
}
