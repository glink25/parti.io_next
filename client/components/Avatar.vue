<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="editing"
                class="modal absolute w-full h-full transition-opacity opacity-20 top-0 left-0 z-0 bg-[black]"
                @click="close">
            </div>
        </Transition>
    </Teleport>
    <div ref="positioned" class="w-10 h-10 relative">
        <div class="absolute rounded-xl w-10 h-10 bg-[#f1f5fd] transition-all z-1 flex justify-around items-center flex flex-col cursor-pointer overflow-hidden"
            :class="{ 'editing-position !rounded-2xl': editing }" @click="editing = true">
            <div class="w-full h-full p-2 transition-all" :class="{ '!h-[40%] py-4': editing }">
                <img :src="avatarURL" class="w-full h-full object-contain" alt="">
            </div>
            <input v-model="inputName"
                class="text-center outline-none bg-[rgba(225,225,225,0.6)] rounded-lg font-bold h-0 transition-all opacity-0"
                :class="{ 'py-2 h-auto opacity-100': editing }">
        </div>
    </div>
</template>
<script lang="ts" setup>
import { createIconImg } from 'client/utils/icon';
import { nextTick, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue';

const props = defineProps<{
    name: string
}>()

const emit = defineEmits<{
    (name: 'change', value: string): void
}>()

const inputName = ref(props.name)

const avatarURL = ref()
watchEffect(async () => {
    avatarURL.value = await createIconImg(inputName.value)
})

const editing = ref(false)
const close = () => {
    editing.value = false;
    if (inputName.value !== props.name) emit('change', inputName.value)
}
</script>
<style lang="scss" scoped>
.editing-position {
    position: absolute;
    --maxW: 300px;
    --maxH: var(--maxW);
    --w: min(var(--maxW), 90vw);
    --h: min(var(--maxH), 90vh);
    // 8px 代表父组件位置的偏移量
    --offsetX: 8px;
    width: var(--w);
    height: var(--h);
    // 800px 代表Frame框架的max-width
    transform: translateX(calc((min(var(--actVw), 800px) - var(--w)) / 2 - var(--offsetX))) translateY(calc((min(var(--actVh), 800px) - var(--h)) / 2));
}
</style>