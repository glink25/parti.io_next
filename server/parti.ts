import { Server } from "socket.io";
import { UserManager } from "./user";
import { RoomManager } from "./room";
import { ClientEmitMap, ClientListenerMap, PartiClientState } from "shared/type";
import { batch } from "shared/batch";

export const startParti = (io: Server<ClientEmitMap, ClientListenerMap>, hostURL: string) => {
    const userManager = new UserManager()
    const roomManager = new RoomManager()
    console.log('parti started')

    const emitToAll = batch<PartiClientState>((data) => {
        io.emit('patch', data)
    })
    const updateAllState = () => {
        emitToAll({ globalInfo: { ...userManager.info, rooms: roomManager.info, hostURL } })
    }


    io.use((socket, next) => {
        const { uuid, name } = socket.handshake.auth;
        if (!uuid || !name) {
            next(new Error('no token found'))
            return
        }
        next()
        const user = userManager.bind(uuid, name)
        const emit = batch<PartiClientState>((data) => {
            socket.emit('patch', data)
        })

        const catchWrapper = <T extends any[]>(fn: (...args: T) => void) => {
            return (...args: T) => {
                try {
                    fn(...args)
                } catch (error) {
                    console.error(error)
                    socket.emit('error', error instanceof Error ? error.message : error)
                }
            }
        }

        const updateRoomState = () => {
            const room = roomManager.rooms.find(room => room.find(uuid))
            io.sockets.sockets.forEach((soc) => {
                if (soc.handshake.auth.uuid !== uuid && room?.find(soc.handshake.auth.uuid)) {
                    soc.emit('patch', { roomInfo: roomManager.getPersonalInfo(soc.handshake.auth.uuid), })
                }
            })
        }

        const updatePersonalState = () => {
            emit({ userInfo: { name: user.name }, roomInfo: roomManager.getPersonalInfo(uuid) })
            updateRoomState()
        }
        const onChange = () => {
            updatePersonalState()
            updateAllState()
            updateRoomState()
        }
        onChange()

        const stopListenUser = userManager.onChange(onChange)

        const stopListenRoom = roomManager.onChange(onChange)

        socket.on('disconnect', () => {
            user.online = false;
            roomManager.forceNotify()
            stopListenUser()
            stopListenRoom()
        })


        socket.on('user:change-name', (newName) => {
            userManager.changeUserName(uuid, newName)
        })

        socket.on('room:create', catchWrapper((type) => {
            const room = roomManager.createRoom(type, user)
            // const space = `/room:${room.id}`
            // io.of(space)
            // socket.join(space)

        }))
        socket.on('room:join', catchWrapper((roomId) => {
            roomManager.joinRoom(roomId, user)
            // const space = `/room:${roomId}`
            // socket.join(space)

        }))
        socket.on('room:leave', catchWrapper(() => {
            roomManager.leaveRoom(user)
        }))

        socket.on('room:kick-out', catchWrapper((targetId) => {
            const targetUser = userManager.find(targetId)
            if (targetUser) {
                roomManager.kikOut(user, targetUser)
            }
        }))

        socket.on('room:start', catchWrapper(() => {
            roomManager.start(user)
        }))

        socket.on('game:next', catchWrapper((...args) => {
            roomManager.next(user, ...args)
        }))



    })


}