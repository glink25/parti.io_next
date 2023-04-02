import { Games } from 'shared/config';
import { ClientEmitMap, ClientListenerMap, RoomInfo, User } from 'shared/type';
import { Server, Socket } from 'socket.io';
import { v1 } from 'uuid';
import { GameConfig } from './games/config';
import { Game } from './games/game';
import { Notifier } from './notifier';
import { ServerUser } from './user';

class Joiner {
    public ready = false
    public loaded = false
    constructor(public user: ServerUser) {

    }
}

class Room extends Notifier<RoomInfo> {
    public joiners: Joiner[] = []
    find(uuid: string) {
        return this.joiners.find((joiner) => joiner.user.uuid === uuid)
    }

    private readonly GameConstructor: typeof Game
    public readonly id = v1()
    constructor(public readonly gameType: Games) {
        super()
        this.GameConstructor = GameConfig[this.gameType] as any
        if (this.GameConstructor === undefined) throw new Error("Game type not exist");
    }

    // TODO: 通过装饰器将方法标记为需要触发通知变更的，即需要调用this.notify()，并且可以通过传入判断函数判断是否需要通知
    // @change
    add(user: ServerUser) {
        if (this.find(user.uuid) || !this.available) return
        this.joiners.push(new Joiner(user))
        this.notify()
    }

    // @change
    remove(user: ServerUser) {
        this.joiners = this.joiners.filter(joiner => joiner.user.uuid !== user.uuid)
        this.notify()
    }

    game?: Game
    start() {
        if (!this.ready) return
        // TODO: await all users to be loaded
        this.game = new this.GameConstructor({
            players: this.joiners.map(joiner => joiner.user),
            onEnd: () => {
                this.game?.clearAllListeners()
                this.game = undefined
                this.notify()
            },
        })
        this.game.onChange((info) => {
            this.notify(info ? { gameInfo: info } : undefined)
        })
        this.game.start()
    }
    get ready() {
        return this.joiners.length <= this.GameConstructor.limitation.max && this.joiners.length >= this.GameConstructor.limitation.min
    }

    get available() {
        const length = this.joiners.length
        return length < this.GameConstructor.limitation.max && this.game === undefined
    }

    getPersonalInfo(uuid: string): RoomInfo {
        return {
            joiners: this.joiners.map((joiner, index) => ({ ...joiner.user, admin: index === 0, ready: joiner.ready })),
            gameInfo: this.game?.getPersonalInfo(uuid) ?? null,
            type: this.gameType,
            id: this.id,
            ready: this.ready
        }
    }
}

export class RoomManager extends Notifier {
    public rooms: Room[] = []

    // @change
    createRoom(type: Games, user: ServerUser) {
        if (this.rooms.some(room => room.find(user.uuid))) throw new Error("user already in one room");
        const room = new Room(type)
        this.rooms.push(room)
        room.add(user)
        room.onChange(() => { this.notify() })
        this.notify()
        return room
    }

    // @change
    joinRoom(roomId: string, user: ServerUser) {
        if (this.rooms.some(room => room.find(user.uuid))) throw new Error("user already in one room");
        const room = this.rooms.find(room => room.id === roomId)
        if (!room) throw new Error("room not exist");
        room.add(user)
        this.notify()
    }

    // @change
    leaveRoom(user: ServerUser) {
        const room = this.rooms.find(r => r.find(user.uuid))
        console.log(room, 'leavero')
        if (!room) return;
        room.remove(user)
        if (room.joiners.length === 0) {
            // clear room
            // room.clearAllListeners()
            this.rooms = this.rooms.filter((r) => r.id !== room.id)
        }
        this.notify()
    }

    kikOut(creator: ServerUser, targetUser: ServerUser) {
        const room = this.rooms.find(room => room.find(creator.uuid))
        if (!room) return
        this.leaveRoom(targetUser)
    }

    start(user: ServerUser) {
        const room = this.rooms.find(r => r.find(user.uuid))
        if (!room) return;
        room.start()
    }
    next(user: ServerUser, ...args: any[]) {
        const room = this.rooms.find(r => r.find(user.uuid))
        if (!room) return;
        room.game?.next(user.uuid, ...args)
    }

    get info() {
        return this.rooms.map((room) => ({ id: room.id, available: room.available, type: room.gameType }))
    }

    getPersonalInfo(uuid: string) {
        const room = this.rooms.find(room => room.find(uuid))
        if (!room) return null
        return room.getPersonalInfo(uuid)
    }
}
