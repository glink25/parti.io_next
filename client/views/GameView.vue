<template>
    <div class="w-full h-full">
        <Suspense v-if="showGame">
            <component :is="GameComponent"></component>
        </Suspense>
    </div>
</template>
<script lang="ts" setup>
import { GameConfig } from 'client/games/config';
import { useSocketStore } from 'client/hooks/socket';
import { Games } from 'shared/config';
import { computed, defineAsyncComponent, onErrorCaptured, provide } from 'vue';
import { useRoute } from 'vue-router';


const route = useRoute()
const gameConfig = GameConfig[route.params.gameType as Games]
const GameComponent = defineAsyncComponent(gameConfig.gameComponent)
const showGame = computed(() => Boolean(useSocketStore().state.roomInfo?.gameInfo))

</script>