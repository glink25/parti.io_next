<template>
    <div class="w-full h-full flex flex-col justify-center items-center">
        <div class="py-4">Tic Tac Toe</div>
        <div class="flex justify-center items-center">
            <div class="text-lg font-bold w-40 text-center">You: {{ gameInfo.piece === Piece.O ? 'O' : 'X' }}</div>
            <Board :config="gameInfo.board" :disabled="!gameInfo.canMove || Boolean(gameInfo.winnerInfo)"
                :highlights="gameInfo.winnerInfo?.positions ?? []" @click="(pos) => send({ type: 'move', position: pos })">
            </Board>
            <div class="text-lg font-bold w-40 text-center">{{ opponent.name }}: {{ gameInfo.piece === Piece.O ? 'X' : 'O'
            }}</div>
        </div>
        <div v-if="!gameInfo.winnerInfo" class="py-4 text-lg font-bold">
            {{ gameInfo.canMove ? 'Your turn' : `${opponent.name}'s turn` }}
        </div>
        <template v-else>
            <div class="py-4 text-lg font-bold">
                {{ gameInfo.winnerInfo.winner === joiner.uuid ? 'You' : opponent.name }} Win !
            </div>
            <template v-if="joiner.admin">
                <button class="bg-yellow rounded-lg px-2 py-1 text-white my-1" @click="playAgain">Play Again</button>
                <button class="bg-black rounded-lg px-2 py-1 text-white my-1" @click="quit">Quit</button>
            </template>
        </template>
    </div>
</template>
<script lang="ts" setup>
import { useGame } from 'client/hooks/useGame';
import { computed } from 'vue';
import { JinziqiEvent, JinziqiGameInfo, Piece } from '../jinziqi';
import Board from './Board.vue';

const { gameInfo, send, joiner, players } = useGame<JinziqiEvent, JinziqiGameInfo>()
const opponent = computed(() => players.value.find((j) => j.uuid !== joiner.value.uuid)!)

const playAgain = () => send({ type: 'play-again' })

const quit = () => send({ type: 'quit' })

</script>