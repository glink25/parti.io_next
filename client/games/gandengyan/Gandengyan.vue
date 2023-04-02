<template>
    <div class="w-full h-full flex flex-col bg-green-700">
        <div class="text-center">👀</div>
        <div class="flex-1 flex flex-col">
            <div class="flex overflow-x-auto">
                <template v-for="(p, i) in gameInfo.globals" :key="i">
                    <div v-if="i !== joiner.index" class="flex items-center p-2 transition-all w-[fit-content]"
                        :class="{ 'scale-105': gameInfo.mover === i }">
                        <AvatarIcon :name="players[i].name" show-name></AvatarIcon>
                        <div
                            class="w-6 h-8 bg-stone-200 rounded border border-green-800 m-1 flex justify-center items-center">
                            {{ p.left }}</div>
                        <div v-if="i === gameInfo.mover">
                            <div class="i-mdi:triangle-down bg-green"></div>
                        </div>
                    </div>
                </template>
            </div>
            <div class="flex-1">
                <Stage :info="stageInfo"></Stage>
            </div>
        </div>
        <div class="flex flex-col justify-center items-center w-full">
            <div class="w-full">
                <div v-if="gameInfo.canMove" class="w-full py-1">
                    <div class="py-1 pb-10 w-full flex justify-center">
                        <button class="m-1 bg-green-400 text-white rounded px-2 py-1 vibrant disabled:bg-gray"
                            :disabled="!gameInfo.canMove" @click="sendCards()">send</button>
                        <button class="m-1 bg-green-400 text-white rounded px-2 py-1 vibrant disabled:bg-gray"
                            :disabled="!gameInfo.canMove || !canPass" @click="pass()">pass</button>
                    </div>
                    <!-- <div class="flex px-2 justify-end">
                        <div class="i-mdi:triangle-down bg-green"></div>
                    </div> -->
                </div>
                <Deck ref="deckRef" :cards="gameInfo.cards"></Deck>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import AvatarIcon from 'client/components/AvatarIcon.vue';
import { showConfirm } from 'client/components/confirm';
import { useGame } from 'client/hooks/useGame';
import { GandengyanEvent, GandengyanGameInfo, standardizeCards } from 'shared/games/gandengyan';
import { computed, ref, watch, watchEffect } from 'vue';
import Deck from './Deck.vue';
import Stage from './Stage.vue';

const { gameInfo, players, send, joiner } = useGame<GandengyanEvent, GandengyanGameInfo>()

const stageInfo = computed(() => gameInfo.value.stage.map((round) => ({ ...round, player: players[round.sender] })))

const canPass = computed(() => !(stageInfo.value.length === 0 && gameInfo.value.canMove))

const deckRef = ref<InstanceType<typeof Deck>>()
const sendCards = () => {
    if (!gameInfo.value.canMove) return;
    // validate cards locally
    const cards = deckRef.value?.getSelectedCards()
    if (!cards || cards?.length === 0) return
    console.log(standardizeCards(cards))
    send({ type: 'move', cards })
    deckRef.value?.clearSelected()
}
const pass = () => {
    if (!gameInfo.value.canMove || !canPass.value) return;
    send({ type: 'move' })
}

const selections = ['Play again', 'Quit'] as const
let shows: Promise<string>
const checkWinner = async () => {
    if (gameInfo.value.winner && !shows) {
        const winner = players.value.find(p => p.uuid === gameInfo.value.winner)!
        const isMe = winner.uuid === joiner.value.uuid
        shows = showConfirm({ content: `${isMe ? 'You' : winner.name} wins!`, selections: isMe ? selections : ['Ok'] })
        const selection = await shows
        if (selection === 'Play again') {
            send({ type: 'play-again' })
            return
        }
        if (selection === 'Quit') {
            send({ type: 'quit' })
            return
        }
    }
}
checkWinner()
watch(() => gameInfo.value.winner, checkWinner)
</script>