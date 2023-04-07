<template>
    <div class="w-full h-full">
        <iframe v-if="showGame && gameConfig" ref="iframeRef" :src="gameConfig.index" class="w-full h-full"></iframe>
    </div>
</template>
<script lang="ts" setup>
import { useSocketStore } from 'client/hooks/socket';
import { registerHook, registerUtils } from 'client/hooks/useGame';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';


const route = useRoute()
console.log(route.params)
const gameConfig = computed(() => useSocketStore().state.globalInfo.games.find(x => x.type === route.params.gameType))
const showGame = computed(() => Boolean(useSocketStore().state.roomInfo?.gameInfo))

const iframeRef = ref<HTMLIFrameElement>()
onMounted(() => {
    registerHook(iframeRef.value?.contentWindow)
    registerUtils(iframeRef.value?.contentWindow)
})

</script>