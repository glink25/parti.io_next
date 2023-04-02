<template>
    <div class="w-full h-full flex justify-center items-center">
        <div>
            <Transition name="card-stage">
                <div class="flex" :key="`${top?.[0].rank}-${top?.[0].suit}`">
                    <Poker v-for="(card, index) in info.at(-1)?.cards" :key="`${card.suit}${card.rank}`" :poker="card">
                    </Poker>
                </div>
            </Transition>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { StandardCards } from 'shared/games/gandengyan';
import { User } from 'shared/type';
import { computed } from 'vue';
import Poker from './Poker.vue';

const props = defineProps<{
    info: (StandardCards & { player: User })[]
}>()

const top = computed(() => props.info.at(-1)?.cards)
</script>
<style lang="scss" scoped>
.card-stage {

    &-move,
    &-enter-active,
    &-leave-active {
        transition: all 0.2s ease;
        transform: scale(1);
    }

    &-enter-from {
        transform: scale(1.3);
        opacity: 0;
        position: absolute;
    }

    &-leave-to {
        transform: scale(0.7);
        opacity: 0;
        position: absolute;
    }
}
</style>