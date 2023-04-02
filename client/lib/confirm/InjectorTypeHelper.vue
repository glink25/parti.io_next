<template>
    <slot name="default" v-bind="{ close }"></slot>
</template>
<script lang="ts" setup>
// defineProps<{
//     name: string
// }>()

const close = (message?: string) => {

}

defineExpose({
    teleportTo: (ref: any, key: any) => { }
})
</script>