<template>
    <div class="flex flex-col">
        <div v-for="(rows, i) in config" class="flex flex-row">
            <button v-for="(col, j) in rows" :disabled="disabled"
                class="min-h-10 min-w-10 flex items-center justify-center bg-gray border disabled:cursor-not-allowed"
                :class="{ 'bg-yellow': highlights.some(([hi, hj]) => hi === i && hj === j) }"
                @click="$emit('click', [i, j])">
                {{ col === Piece.X ? 'X' : (col === Piece.O ? 'O' : '') }}
            </button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { Piece } from '../jinziqi';

defineProps<{
    config: number[][],
    disabled?: boolean,
    highlights: number[][],
}>()

defineEmits<{
    (name: 'click', position: [number, number])
}>()
</script>