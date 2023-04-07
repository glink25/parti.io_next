import { createDeck, PokerCard, shuffle } from "./poker";

export type GandengyanEvent = { type: 'move', cards?: PokerCard[] } | { type: 'play-again' } | { type: 'quit' }

export type GandengyanGameInfo = { canMove: boolean, mover: number, cards: PokerCard[], stage: (StandardCards & { sender: number })[], winner: string | null, globals: { left: number }[] }

enum CardsType {
    Single, //单张 1张
    Double, //对子 2张 2可以代替任意一张牌
    Shunzi, //顺子 大于2张，数值连续，2、大王、小王可以代替任意一张牌
    Bomb, // 炸弹 大于2张，数值相同，大王、小王可以代替任意一张牌
}



export const standardizeCards = (cards: PokerCard[]) => {
    if (cards.length === 0) return
    if (cards.length === 1) {
        // 大小王不能单出
        return cards[0].isJoker ? undefined : {
            type: CardsType.Single,
            value: cards[0].value,
            cards
        }
    }
    if (cards.length === 2) {
        // 大小王不能单独作为对子
        if (cards[0].isJoker || cards[1].isJoker) return
        // 数值相同的两张牌为对子
        if (cards[0].value === cards[1].value) return {
            type: CardsType.Double,
            value: cards[0].value,
            cards
        }
        // 两张牌中一张牌为2也可作为对子
        const card2Index = cards.findIndex(c => c.rank === '2')
        if (card2Index === -1) return
        return {
            type: CardsType.Double,
            value: cards[1 - card2Index].value,
            cards
        }
    }
    // 多张牌中除去大小王后数值相同为炸弹
    if (cards.every((card, i, arr) => card.rank === arr.at(-1)!.rank || card.rank === 'X' || card.rank === 'Y')) {
        return {
            type: CardsType.Bomb,
            value: cards[0].value,
            cards
        }
    }
    // 检查是否为顺子
    const shun = cards.map((card, i, arr) => {
        if (['2', 'X', 'Y'].includes(card.rank)) {
            const prev = arr[i - 1]
            if (prev) {
                return new PokerCard(prev.value + 1)
            }
            const next = arr[i + 1]
            return new PokerCard(next.value - 1)
        }
        return card
    })
    console.log(shun, 'shun', cards)
    const isShunzi = shun.sort((a, b) => a.value - b.value).every((card, i, arr) => {
        if (i === 0) return true;
        const prev = arr[i - 1]
        return card.value - prev.value === 1
    })
    if (isShunzi) {
        return {
            type: CardsType.Shunzi,
            value: cards[0].value,
            cards
        }
    }
    return
}
export type StandardCards = Exclude<ReturnType<typeof standardizeCards>, undefined>


export const compareCard = (prevCards: StandardCards, nextCards: StandardCards) => {
    if (nextCards.type === CardsType.Bomb) {
        return prevCards.type === CardsType.Bomb ? nextCards.value > prevCards.value : true
    }
    if (nextCards.cards.length !== prevCards.cards.length) return false
    if (nextCards.type !== prevCards.type) return false
    if (prevCards.cards.length === 1) {
        if (nextCards.cards[0].rank === '2') {
            return prevCards.cards[0].rank !== '2'
        }
    }
    if (nextCards.value - prevCards.value !== 1) return false
    return true
}

export class MutableGandengyan {
    private deck = shuffle(createDeck())

    private players: PokerCard[][]
    private stage: (StandardCards & { sender: number })[] = []
    private winner?: number

    constructor(playerCount: number) {
        if (playerCount > this.deck.length * 5 + 1) throw new Error("player count exceeded");
        this.players = [...Array(playerCount)].fill([])
    }
    start() {
        for (let i = 0; i < 5; i += 1) {
            for (let j = 0; j < this.players.length; j++) {
                this.players[j] = [...this.players[j], this.deck.shift()!]
            }

        }
        this.players[0] = [...this.players[0], this.deck.shift()!]
        console.log(this.players)
    }

    mover = 0
    next(playerIndex: number, rawCards?: PokerCard[]) {
        if (this.winner !== undefined) return
        const moveToNext = () => {
            this.mover = (this.mover === this.players.length - 1) ? 0 : (this.mover + 1)
        }
        if (playerIndex !== this.mover) throw new Error("not player's move");

        const cards = rawCards?.map(r => new PokerCard(r.value, r.suit))
        if (!cards) {
            if (this.stage.length === 0 || this.stage.at(-1)?.sender === playerIndex) {
                throw new Error("latest sender cannot pass");
            }
            moveToNext()
            return
        }

        if (!cards.every((card) => this.players[playerIndex].some(c => c.isSame(card)))) {
            throw new Error("cards not matched");
        }

        const standard = standardizeCards(cards)

        if (!standard) throw new Error("cards not illegal");

        const stageCards = () => {
            this.players[playerIndex] = this.players[playerIndex].filter(card => !cards.some(c => c.isSame(card)))
            this.stage.push({ ...standard, sender: playerIndex })
            if (this.players[playerIndex].length === 0) {
                this.winner = playerIndex;
                return
            }
            moveToNext()
        }

        // 一轮后无人能接牌，从最后出牌者开始重新抓牌出牌
        if (playerIndex === this.stage.at(-1)?.sender) {
            stageCards()
            this.players[playerIndex].push(this.deck.shift()!)
            return
        }

        if (this.stage.length === 0 || compareCard(this.stage.at(-1)!, standard)) {
            stageCards()
            return
        }
        throw new Error('cards not meet the demand')
    }

    get info() {
        return {
            mover: this.mover,
            players: this.players,
            winner: this.winner,
            stage: this.stage
        }
    }

}


export class Gandengyan {
    readonly deck: PokerCard[]

    readonly players: PokerCard[][]
    readonly stage: (StandardCards & { sender: number })[] = []
    readonly winner?: number
    readonly mover: number
    constructor(from: { deck: PokerCard[], players: PokerCard[][], stage: (StandardCards & { sender: number })[], mover: number, winner?: number } | number) {
        if (typeof from === 'number') {
            const deck = shuffle(createDeck())
            if (from > deck.length * 5 + 1) throw new Error("player count exceeded");
            this.stage = []
            this.mover = 0
            this.players = [...Array(from)].fill(0).map((_, i) => {
                if (i === from - 1) return deck.slice(i * 5, i * 5 + 6)
                return deck.slice(i * 5, i * 5 + 5)
            }).reverse()
            this.deck = deck.slice(from * 5 + 1)
            return
        }
        this.winner = from.winner
        this.mover = from.mover
        this.deck = from.deck
        this.players = from.players
        this.stage = from.stage

    }

    next(playerIndex: number, rawCards?: PokerCard[]) {
        if (this.winner !== undefined) throw new Error("");

        if (playerIndex !== this.mover) throw new Error("not player's move");

        const cards = rawCards?.map(r => new PokerCard(r.value, r.suit))
        if (!cards) {
            if (this.stage.length === 0 || this.stage.at(-1)?.sender === playerIndex) {
                throw new Error("latest sender cannot pass");
            }
            return this.moveToNext()
        }

        if (!cards.every((card) => this.players[playerIndex].some(c => c.isSame(card)))) {
            throw new Error("cards not matched");
        }

        const standard = standardizeCards(cards)

        if (!standard) throw new Error("cards not illegal");

        const stageCards = () => {
            const newPlayers = this.players.map((_, i) => (i === playerIndex) ? _.filter(card => !cards.some(c => c.isSame(card))) : _)
            const newStage = [...this.stage, { ...standard, sender: playerIndex }]
            if (newPlayers[playerIndex].length === 0) {
                const winner = playerIndex;
                return new Gandengyan({ ...this, players: newPlayers, stage: newStage, winner })
            }
            return new Gandengyan({ ...this, players: newPlayers, stage: newStage }).moveToNext()
        }

        // 一轮后无人能接牌，从最后出牌者开始重新抓牌出牌
        if (playerIndex === this.stage.at(-1)?.sender) {
            const next = stageCards()
            return next
        }

        if (this.stage.length === 0 || compareCard(this.stage.at(-1)!, standard)) {
            return stageCards()
        }
        throw new Error('cards not meet the demand')
    }

    private giveOneCardTo(playerIndex: number) {
        const deck = this.deck
        const headCard = deck.shift()
        const newPlayers = this.players.map((_, i) => i === playerIndex ? [..._, headCard] : _)
        return new Gandengyan({ ...this, deck, players: newPlayers })
    }

    private moveToNext() {
        const mover = (this.mover === this.players.length - 1) ? 0 : (this.mover + 1)
        const next = new Gandengyan({ ...this, mover })
        if (mover === this.stage.at(-1)?.sender) return next.giveOneCardTo(mover)
        return next
    }

    get info() {
        return {
            mover: this.mover,
            players: this.players,
            winner: this.winner,
            stage: this.stage
        }
    }
}