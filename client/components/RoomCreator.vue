<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="visible"
                class="modal absolute w-full h-full transition-opacity opacity-20 top-0 left-0 z-2 bg-[black]"
                @click="visible = false"></div>
        </Transition>
        <Transition name="auto-fade-slide" :duration="200">
            <div v-if="visible" class="absolute top-0 w-full h-full flex justify-center items-center">
                <div
                    class="anchor absolute bg-white z-3 bottom-0 w-full max-w-[600px] h-[90%] max-h-[600px] rounded-t-2xl md:bottom-auto md:rounded-2xl px-2 py-4 flex flex-col items-center">
                    <div class="bg-stone-100 w-8 h-8 flex items-center justify-center rounded-full absolute top-2 right-2 cursor-pointer flex flex-col justify-center"
                        @click="visible = false">
                        <div class="w-5 h-5 bg-stone-500 icon i-mdi:close"></div>
                    </div>
                    <div class="text-lg font-bold text-center">Choose a Game</div>
                    <div class="flex-1 w-full overflow-y-auto pt-10 flex justify-center">
                        <div class="grid grid-cols-4 place-items-center w-[fit-content] h-[fit-content]">
                            <div v-for="(game, index) in Games" :key="index"
                                class="w-40 h-40 bg-gray rounded-lg overflow-hidden shadow vibrant m-2 col-span-2 row-span-2 relative flex justify-center game-item"
                                @click="createRoom(game)">
                                <div class="absolute top-0 w-full h-full z--1"
                                    :style="{ background: `url(${game.cover})` }">
                                </div>
                                <div class="absolute bottom-2 font-bold text-lg text-white text-shadow-lg">{{ game.title }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
<script lang="ts" setup>
import { GameInfo, Games } from 'client/games/config';
import { useSocketStore } from 'client/hooks/socket';
import { Games as GameTypes } from 'shared/config';
import { ref } from 'vue';
const visible = ref(false)

const show = () => {
    visible.value = true
}

defineExpose({ show })

const createRoom = (game: GameInfo & { type: GameTypes }) => {
    useSocketStore().socket.emit('room:create', game.type)
}
</script>
<style lang="scss" scoped>
.game-item:nth-child(1) {
    grid-row-start: 1;
}

.game-item:nth-child(2) {
    grid-row-start: 2;
}
</style>