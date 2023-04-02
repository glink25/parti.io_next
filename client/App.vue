<template>
  <RouterView>
    <template #default="{ Component, route }">
      <Transition :name="route.meta.transition" mode="out-in">
        <component :is="Component"></component>
      </Transition>
    </template>
  </RouterView>
  <NoticeProvider />
  <ConfirmProvider />
</template>
<script lang="ts" setup>
import { ConfirmProvider } from './components/confirm';
import { NoticeProvider, showNotice } from './components/notice';

</script>
