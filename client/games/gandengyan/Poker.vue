<template>
    <!-- <div class="poker w-30 h-40 bg-stone-200 relative rounded flex justify-center items-center border border-stone-900">
        <div class="absolute top-2 right-2">{{ poker.suit }}</div>
        <div>{{ poker.rank }}</div>
    </div> -->
    <div class="poker h-40">
        <!-- <div class="absolute top-2 right-2">{{ poker.suit }}</div> -->
        <div class="before flex justify-center">
            <div :style="{ color: colors[poker.suit ?? '♠️'] }">
                {{ poker.suit }}
            </div>
        </div>
        <div class="flex justify-center items-center w-full h-full">{{
            poker.rank === 'X' ? 'joker' : (poker.rank === 'Y' ? 'JOKER' : poker.rank) }}</div>
        <div class="after flex justify-center items-end">
            <div :style="{ color: colors[poker.suit ?? '♠️'] }">
                {{ poker.suit }}
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { PokerCard } from 'shared/games/poker';

defineProps<{
    poker: PokerCard
}>()

const colors = {
    "♠️": 'black', "♥️": "red", "♣️": 'black', "♦️": 'red'
}
</script>
<style lang="scss" scoped>
.poker {
    --pw: 90px;
    --ph: 120px;
    --cw: 56px;
    --ew: calc((var(--pw) - var(--cw)) / 2);
    --radius: 8px;
    --bg: hsl(0, 0%, 92%);
    position: relative;
    width: var(--cw);
    height: var(--ph);
    background: var(--bg);
    border: 1px solid black;
    border-left: none;
    border-right: none;

    .before {
        width: var(--ew);
        height: calc(100% + 2px);
        background-color: var(--bg);
        position: absolute;
        top: 0;
        left: 0px;
        transform: translateX(-100%) translateY(-1px);
        border-radius: var(--radius) 0 0 var(--radius);
        border: 1px solid black;
        border-right: none;
    }

    .after {
        width: var(--ew);
        height: calc(100% + 0px);
        background-color: var(--bg);
        position: absolute;
        top: 0;
        right: 0px;
        transform: translateX(100%) translateY(-1px);
        border-radius: 0 var(--radius) var(--radius) 0;
        box-sizing: content-box;
        border: 1px solid black;
        border-left: none;
    }
}
</style>