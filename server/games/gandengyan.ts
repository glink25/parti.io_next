import { GameNext } from "shared/config";
import { Gandengyan, GandengyanEvent, GandengyanGameInfo } from "shared/games/gandengyan";
import { Game } from "./game";

export class GandengyanGame extends Game<GandengyanGameInfo>{
    static limitation = {
        max: 8,
        min: 2,
    }

    private game?: Gandengyan
    start(): void {
        this.game = new Gandengyan(this.players.length)
        this.notify()
    }
    next: GameNext<GandengyanEvent> = (uuid: string, arg) => {
        switch (arg.type) {
            case 'move':
                const { cards } = arg
                const playerIndex = this.players.findIndex(p => p.user.uuid === uuid)
                try {
                    this.game = this.game!.next(playerIndex, cards)
                    this.notify()
                } catch (error) {
                    console.error(error)
                    throw error
                }
                break;
            case 'play-again':
                this.start()
                break
            case 'quit':
                this.game = undefined
                this.end()
            default:
                break;
        }

    }
    getPersonalInfo(uuid: string): GandengyanGameInfo {
        if (!this.game) throw new Error("game is not started");

        const info = this.game.info
        const index = this.players.findIndex(p => p.user.uuid === uuid)
        return {
            canMove: index === info.mover,
            mover: info.mover,
            cards: info.players[index],
            stage: info.stage,
            winner: (info.winner !== undefined) ? this.players[info.winner].user.uuid : null,
            globals: info.players.map((cards) => ({ left: cards.length }))
        }
    }
}