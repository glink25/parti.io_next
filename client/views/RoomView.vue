<template>
  <Frame :style="{ background: `url(${gameInfo?.cover})`, backgroundSize: 'cover' }">
    <div class="p-2 flex items-center justify-between">
      <div
        class="bg-stone-100 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer flex flex-col justify-center shdaow"
        @click="leaveRoom">
        <div class="w-5 h-5 bg-stone-500 icon i-mdi:arrow-left"></div>
      </div>
      <div class="font-bold text-lg text-white text-shadow-lg">
        {{ roomInfo?.type ? GameConfig[roomInfo.type].title : '' }}
      </div>
      <div
        class="bg-stone-100 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer flex flex-col justify-center shadow"
        @click="shareRoom">
        <div class="w-5 h-5 bg-stone-500 icon i-mdi:share"></div>
      </div>
    </div>
    <div class="flex-1 p-2">
      <div class="flex items-center justify-center">
        <div v-for="joiner in roomInfo?.joiners ?? []" :key="joiner.uuid" class="m-2"
          :class="{ 'opacity-50': !joiner.online }">
          <div class="relative">
            <AvatarIcon :name="joiner.name" class="w-18 h-18 shadow-md" show-name
              :class="{ 'outline-stone-500': joiner.uuid === userInfo.uuid, }">
            </AvatarIcon>
            <button v-if="isCreator && joiner.uuid !== userInfo.uuid"
              class="bg-stone-100 w-6 h-6 flex items-center justify-center rounded-full cursor-pointer flex flex-col justify-center absolute top-1 right-1"
              @click="kickOut(joiner.uuid)">
              <div class="w-5 h-5 bg-stone-500 icon i-mdi:close"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
    <button v-if="isCreator" :disabled="!roomInfo?.ready"
      class="m-2 p-4 rounded-2xl bg-yellow text-white text-center font-xl font-bold vibrant shadow disabled:bg-gray disabled:pointer-events-none"
      @click="startGame">
      Start
    </button>
    <ConfirmSlotInjector ref="qrcodeSlot">
      <template #default="{ close }">
        <div>
          <canvas ref="qrcodeEl" class="w-[250px] h-[250px]"></canvas>
        </div>
        <div class="py-2 text-sm">Share to friends to quickly join this room</div>
        <div
          class="bg-stone-100 w-8 h-8 flex items-center justify-center rounded-full absolute top-2 right-2 cursor-pointer flex flex-col justify-center"
          @click="close()">
          <div class="w-5 h-5 bg-stone-500 icon i-mdi:close"></div>
        </div>
      </template>
    </ConfirmSlotInjector>
  </Frame>
</template>
<script lang="ts" setup>
import AvatarIcon from 'client/components/AvatarIcon.vue';
import { ConfirmSlotInjector, showConfirm } from 'client/components/confirm';
import Frame from 'client/components/Frame.vue';
import { GameConfig } from "client/games/config";
import { useSocketStore } from 'client/hooks/socket';
import { createQrCodeOnCanvas } from 'client/utils/qrcode';
import { computed, ref, nextTick } from 'vue';
import { urlHandler } from 'client/router';

const roomInfo = computed(() => useSocketStore().state.roomInfo)
const userInfo = computed(() => useSocketStore().state.userInfo)
const gameInfo = computed(() => roomInfo.value?.type ? GameConfig[roomInfo.value?.type] : undefined)


const isCreator = computed(() => roomInfo.value?.joiners.some(joiner => joiner.admin && joiner.uuid === userInfo.value.uuid))

const leaveRoom = () => {
  useSocketStore().socket.emit('room:leave')
}

const kickOut = (uuid: string) => {
  if (!isCreator.value) return
  useSocketStore().socket.emit('room:kick-out', uuid)
}

const startGame = () => {
  if (!roomInfo.value?.ready) return
  useSocketStore().socket.emit('room:start')
}

const qrcodeEl = ref<HTMLCanvasElement>()
const qrcodeSlot = ref()
const shareRoom = async () => {
  showConfirm({ injector: qrcodeSlot.value, modalClose: true, customContentClass: 'qrcode-content' })
  await nextTick()
  const url = useSocketStore().state.globalInfo.hostURL
  createQrCodeOnCanvas(urlHandler.createURL({ roomId: roomInfo.value?.id }, url), qrcodeEl.value!, { width: 200 })
}

</script>
<style lang="scss">
.qrcode-content {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  position: relative;
}
</style>