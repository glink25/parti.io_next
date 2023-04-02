export enum Piece {
    O, // 代表 O
    X  // 代表 X
}
export type JinziqiEvent = { type: 'move', position: [number, number] } | { type: 'play-again' } | { type: 'quit' }

export type JinziqiGameInfo = { canMove: boolean, board: number[][], piece: Piece, winnerInfo?: { winner: string, positions: number[][] } | null }

export const assignPiece = <T extends { uuid: string }>(uid: string, uids: T[]) => {
    if (uids.findIndex(x => x.uuid === uid) === 0) return Piece.O
    return Piece.X
}
export class JinziqiBoard {
    static empty = [
        [-1, -1, -1],
        [-1, -1, -1],
        [-1, -1, -1]
    ]
    static replace(original: number[][], [px, py]: [number, number], value: number) {
        return original.map((_, x) => _.map((ov, y) => (px === x && py === y) ? value : ov))
    }
    static check(layout: number[][]) {
        const checkRows = () => {
            const [x, isFull] = [0, 1, 2].map((x) => {
                if (layout[x][0] !== -1 && layout[x][0] === layout[x][1] && layout[x][0] === layout[x][2]) {
                    return [x, layout[x][0]]
                }
                return [x, -1]
            }).find(([row, isFull]) => isFull !== -1) ?? [undefined, undefined]
            if (x !== undefined) {
                return { piece: isFull as Piece, positions: [[x, 0], [x, 1], [x, 2]] }
            }
        }
        const checkCols = () => {
            const [y, isFull] = [0, 1, 2].map((y) => {
                if (layout[0][y] !== -1 && layout[0][y] === layout[1][y] && layout[0][y] === layout[2][y]) {
                    return [y, layout[0][y]]
                }
                return [y, -1]
            }).find(([row, isFull]) => isFull !== -1) ?? [undefined, undefined]
            if (y !== undefined) {
                return { piece: isFull as Piece, positions: [[0, y], [1, y], [2, y]] }
            }
        }
        const checkCross = () => {
            if (layout[1][1] !== -1 && layout[0][0] === layout[1][1] && layout[1][1] === layout[2][2]) {
                return { piece: layout[1][1] as Piece, positions: [[0, 0], [1, 1], [2, 2]] }
            }
            if (layout[1][1] !== -1 && layout[0][2] === layout[1][1] && layout[0][2] === layout[2][0]) {
                return { piece: layout[1][1] as Piece, positions: [[0, 2], [1, 1], [2, 0]] }
            }
        }
        return checkRows() ?? checkCross() ?? checkCols()
    }

    public readonly winner?: { piece: Piece, positions: number[][] }
    constructor(public readonly latest?: Piece, public readonly layout = JinziqiBoard.empty) {
        this.winner = JinziqiBoard.check(this.layout)
    }
    next(piece: Piece, position: [number, number]) {
        if (!this.validatePiece(piece)) {
            throw new Error("not your move");
        }
        if (!this.validatePosition(position)) {
            throw new Error('not allowed')
        }
        return new JinziqiBoard(piece, JinziqiBoard.replace(this.layout, position, piece))
    }

    validatePiece(piece: Piece) {
        return piece === undefined || piece !== this.latest
    }
    validatePosition([x, y]: [number, number]) {
        if (x > 2 || x < 0 || y > 2 || y < 0) return false
        if (this.layout[x][y] !== -1) return false
        return true
    }

}