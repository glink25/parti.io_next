import { showConfirm } from "client/components/confirm"
import { computed, ComputedRef, customRef, ref, shallowRef, watch, watchEffect } from "vue"
import { useSocketStore } from "./socket"

declare global {
    interface Window {
        __gameInfo: any,
        __send: any,
        __joiner: any,
        __players: any,
        __showConfirm: any
    }
}

export const createNotified = <T>(fn: () => T) => {
    const notifier = new EventTarget()
    const computer = computed(() => fn())
    watch(() => computer.value, (v) => {
        notifier.dispatchEvent(new CustomEvent('value-change', { detail: v }))
    })
    return { computer, notifier }
}

export const transformToReactive = <T>({ notifier, computer }: ReturnType<typeof createNotified<T>>) => {
    const _ref = shallowRef(computer.value)
    const custom = computed(() => _ref.value)
    notifier.addEventListener('value-change', (e: CustomEvent) => {
        _ref.value = e.detail
    })
    return custom as ComputedRef<T>
}

export const registerHook = <Event, Info>(iframeDocument: any) => {
    const gameInfo = createNotified(() => useSocketStore().state.roomInfo?.gameInfo as Info)
    const send = (arg: Event) => {
        useSocketStore().socket.emit('game:next', arg)
    }
    const userInfo = createNotified(() => useSocketStore().state.userInfo)
    const joiner = createNotified(() => {
        const index = useSocketStore().state.roomInfo?.joiners.findIndex(j => j.uuid === userInfo.computer.value.uuid)!
        return { ...useSocketStore().state.roomInfo?.joiners[index]!, index }
    })
    const players = createNotified(() => useSocketStore().state.roomInfo?.joiners ?? [])

    iframeDocument.__gameInfo = gameInfo
    iframeDocument.__send = send
    iframeDocument.__joiner = joiner
    iframeDocument.__players = players
    return {
        gameInfo, send, joiner, players
    }
}

export const registerUtils = (iframeDocument: any) => {
    iframeDocument.__showConfirm = showConfirm
    return {
        showConfirm
    }
}



export const useGame = <Event, Info>() => {
    type R = ReturnType<typeof registerHook<Event, Info>>;
    const gameInfo = transformToReactive<Info>(window.__gameInfo as R['gameInfo'])
    const send = window.__send
    const joiner = transformToReactive(window.__joiner as R['joiner'])
    const players = transformToReactive(window.__players as R['players'])
    return {
        gameInfo, send, joiner, players
    }
}

export const useUtils = () => {
    const showConfirm = window.__showConfirm
    return {
        showConfirm
    } as ReturnType<typeof registerUtils>
}