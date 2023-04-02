<template>
    <div class="bg-[#f1f5fd] p-1 w-14 h-14 aspect-square rounded-lg flex flex-col justify-center items-center">
        <div class="flex-1 w-full overflow-hidden">
            <img :src="src" :alt="name" :title="name" class="object-contain w-full h-full">
        </div>
        <div v-if="showName" class="text-xs truncate">{{ name }}</div>
    </div>
</template>
<script lang="ts" setup>
import { useAvatar } from 'client/hooks/useAvatar';

const props = defineProps<{
    name: string,
    showName?: boolean
}>()
const src = useAvatar(props.name)
</script>