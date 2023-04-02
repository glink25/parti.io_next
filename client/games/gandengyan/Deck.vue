<template>
    <div class="w-full flex justify-center items-center bg-green-800 py-2">
        <Poker v-for="(card, index) in cards" :key="`${card.rank}-${index}`" :poker="card"
            class="shadow transform transition-all" :class="{ 'translate-y--10': selectedCardIndexes.includes(index) }"
            @click="toggleIndex(index)" />
    </div>
</template>
<script lang="ts" setup>
import { PokerCard } from 'shared/games/poker';
import { ref } from 'vue';
import Poker from './Poker.vue';

const props = defineProps<{
    cards: PokerCard[]
}>()

const selectedCardIndexes = ref<number[]>([])

const toggleIndex = (index: number) => {
    if (selectedCardIndexes.value.includes(index)) {
        selectedCardIndexes.value = selectedCardIndexes.value.filter(i => i !== index)
        return
    }
    selectedCardIndexes.value.push(index)
}

defineExpose({
    getSelectedCards: () => selectedCardIndexes.value.map(i => props.cards[i]),
    clearSelected: () => selectedCardIndexes.value = []
})


</script>