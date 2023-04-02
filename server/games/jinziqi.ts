import { GameNext } from "shared/config";
import { assignPiece, JinziqiBoard, JinziqiEvent, JinziqiGameInfo, Piece } from "shared/games/jinziqi";
import { Game } from "./game";



export class JinziqiGame extends Game<JinziqiGameInfo> {

    static limitation = {
        max: 2,
        min: 2,
    }

    private board = new JinziqiBoard()
    start(): void {
        this.board = new JinziqiBoard()
        this.notify()
    }
    next: GameNext<JinziqiEvent> = (uuid: string, arg) => {
        switch (arg.type) {
            case 'move':
                const { position } = arg
                const piece = assignPiece(uuid, this.players.map(p => p.user))
                if (!this.board.validatePiece(piece)) return
                try {
                    this.board = this.board.next(piece, position)
                    this.notify()
                    // if (this.board.winner) {
                    //     this.end()
                    // }
                } catch (error) {
                    console.error(error)
                    throw error
                }
                break;
            case 'play-again':
                this.start()
                break
            case 'quit':
                this.end()
            default:
                break;
        }

    }
    get info() {
        const canPlayer0Move = this.board.latest === undefined ? true : this.board.validatePiece(Piece.O)
        return {
            playersInfo: {
                [this.players[0].user.uuid]: {
                    canMove: canPlayer0Move,
                    board: this.board.layout
                },
                [this.players[1].user.uuid]: {
                    canMove: !canPlayer0Move,
                    board: this.board.layout
                }
            },
            winnerInfo: this.board.winner ? {
                winner: this.players[this.board.winner.piece].user.uuid,
                positions: this.board.winner.positions
            } : undefined
        }
    }
    getPersonalInfo(uuid: string): JinziqiGameInfo {
        return {
            winnerInfo: this.info.winnerInfo ?? null,
            ...this.info.playersInfo[uuid]!,
            piece: assignPiece(uuid, this.players.map(p => p.user))
        }
    }

}