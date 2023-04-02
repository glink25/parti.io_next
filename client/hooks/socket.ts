import { createLocalStorageHandler } from 'client/utils/localStorage';
import { DEV_SOCKET_PORT, PORT } from 'shared/server';
import { DeepPartial, PartiClientState, User, ClientEmitMap, ClientListenerMap } from 'shared/type';
import { io, Socket } from 'socket.io-client';
import { createToken } from 'shared/token';
import { markRaw, reactive, readonly, watch, watchEffect } from 'vue';
import { router } from 'client/router';
import { defineStore } from 'pinia';
import { merge } from 'shared/merge';
import { showNotice } from 'client/components/notice';


const wrapSocket = (socket: Socket) => {
  socket.on('error', (err) => {
    console.log(err)
    showNotice({ type: 'error', content: err })
  })
  return socket as Socket<ClientListenerMap, ClientEmitMap>
}

export const useSocketStore = defineStore('socket', () => {

  const [getUserInfo, setUserInfo] = createLocalStorageHandler('userInfo', () => ({ name: `Player ${(Math.random() * 10).toFixed(0)}`, uuid: createToken() } as User))
  const initialUserInfo = getUserInfo()
  const auth = initialUserInfo
  const socket = wrapSocket(io(
    import.meta.env.PROD
      ? ''
      : window.origin.replace(`:${PORT}`, `:${DEV_SOCKET_PORT}`),
    { auth }
  ));

  const connect = new Promise<void>((res, rej) => {
    console.log('socket start connect', socket.connected)
    socket.connect();
    console.log(socket.connected)
    socket.once('connect', () => { res(); console.log('socket connect success') })
    socket.once('connect_error', (err) => { rej(err) })
  })

  const initialState = {
    userInfo: initialUserInfo,
    globalInfo: undefined,
    roomInfo: undefined
  }
  const state = reactive(initialState) as unknown as PartiClientState
  const _patch = (patches: DeepPartial<PartiClientState>) => {
    Object.assign(state, merge(state, patches))
  }

  socket.on('patch', (remoteState) => {
    _patch(remoteState)
  })

  watch(() => state.userInfo.name, () => {
    setUserInfo(state.userInfo)
  })

  // control router
  watchEffect(() => {
    if (state.roomInfo !== undefined) {
      if (state.roomInfo?.gameInfo === null) {
        router.replace(`/room/${state.roomInfo?.id}`)
        return
      }
      if (state.roomInfo?.gameInfo !== undefined) {
        router.replace(`/game/${state.roomInfo.type}`)
        return
      }
      router.replace(`/room/${state.roomInfo?.id}`)
      return
    }
    router.replace('/')

  })


  return {
    state: readonly(state),
    connect: markRaw(connect),
    socket: markRaw(socket)
  }
})

