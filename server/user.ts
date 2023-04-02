import { Notifier } from './notifier';

export class ServerUser {
    public online = true
    constructor(public readonly uuid: string, public name: string) { }
}

export class UserManager extends Notifier<{ total: number }>{
    private users: ServerUser[] = []

    bind = (uuid: string, name: string) => {
        const user = (() => {
            const foundUser = this.users.find(({ uuid: id }) => uuid === id)
            if (foundUser) {
                foundUser.online = true
                return foundUser
            }
            const newUser = new ServerUser(uuid, name)
            this.users.push(newUser)
            return newUser
        })()
        this.notify(this.info)
        return user
    }

    find(uuid: string) {
        return this.users.find(u => u.uuid === uuid)
    }

    // @change
    changeUserName(uuid: string, newName: string) {
        const user = this.users.find(u => u.uuid === uuid)
        if (!user) return
        user.name = newName
        this.notify(this.info)
    }

    get info() {
        return {
            total: this.users.filter(u => u.online).length
        }
    }
}