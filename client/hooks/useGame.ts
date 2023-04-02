import { computed } from "vue"
import { useSocketStore } from "./socket"

export const useGame = <Event, Info>() => {
    const gameInfo = computed(() => useSocketStore().state.roomInfo?.gameInfo as Info)
    const send = (arg: Event) => {
        useSocketStore().socket.emit('game:next', arg)
    }
    const userInfo = computed(() => useSocketStore().state.userInfo)
    const joiner = computed(() => {
        const index = useSocketStore().state.roomInfo?.joiners.findIndex(j => j.uuid === userInfo.value.uuid)!
        return { ...useSocketStore().state.roomInfo?.joiners[index]!, index }
    })
    const players = computed(() => useSocketStore().state.roomInfo?.joiners ?? [])

    return {
        gameInfo,
        joiner,
        send,
        players
    }
}