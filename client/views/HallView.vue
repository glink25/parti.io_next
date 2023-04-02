<template>
  <Frame>
    <div class="p-2 flex justify-between items-center">
      <Avatar :name="userInfo.name" @change="changeUserName"></Avatar>
      <div class="text-sm cursor-pointer text-black text-opacity-50">Parti.io</div>
    </div>
    <div class="flex-1 px-4 flex flex-col">
      <div>
        <div class="text-xl">Let's</div>
        <div class="text-xl font-bold">Play & Joy</div>
      </div>
      <div>
        <div v-for="room in globalInfo?.rooms ?? []"
          class="my-4 p-4 rounded-2xl bg-blue text-white text-center font-xl font-bold vibrant"
          :class="{ '!bg-gray pointer-events-none': !room.available }" @click="room.available && joinRoom(room.id)">
          <div>{{ GameConfig[room.type].title }}</div>
          <div>{{ room.available }}</div>
        </div>
      </div>
      <div v-if="!(globalInfo?.rooms ?? []).length"
        class="flex-1 flex items-center justify-center py-2 text-sm text-stone-400">
        No rooms created, go create one.
      </div>
    </div>
    <button class="m-2 p-4 rounded-2xl bg-yellow text-white text-center font-xl font-bold vibrant" @click="toCreateRoom">
      Create a room
    </button>
    <RoomCreator ref="roomCreate"></RoomCreator>
  </Frame>
</template>
<script lang="ts" setup>
import RoomCreator from 'client/components/RoomCreator.vue';
import { computed, ref } from 'vue';
import Avatar from 'client/components/Avatar.vue';
import { useSocketStore } from 'client/hooks/socket';
import Frame from 'client/components/Frame.vue';
import { GameConfig } from 'client/games/config';
import { ConfirmSlotInjector, showConfirm } from 'client/components/confirm';

const userInfo = computed(() => useSocketStore().state.userInfo)
const globalInfo = computed(() => useSocketStore().state.globalInfo)
const changeUserName = (name: string) => {
  useSocketStore().socket.emit('user:change-name', name)
}

const roomCreate = ref<InstanceType<typeof RoomCreator>>()
const toCreateRoom = () => {
  roomCreate.value?.show()
}

const joinRoom = (roomId: string) => {
  useSocketStore().socket.emit('room:join', roomId)
}
</script>
