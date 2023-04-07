import { useSocketStore } from 'client/hooks/socket';
import {
  type RouteRecordRaw,
  createRouter,
  createMemoryHistory,
} from 'vue-router';
import { clearLocationParams, createURLHandler } from 'client/utils/location';

export const urlHandler = createURLHandler(['roomId'] as const)

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('client/views/HallView.vue'),
    meta: {
      order: 0,
      transition: ''
    },
    beforeEnter: (to, from, next) => {
      urlHandler.checkURL(location.href, (params) => {
        if (params.roomId !== undefined) {
          useSocketStore().socket.emit('room:join', params.roomId)
          clearLocationParams()
        }
      })
      next()
    }
  },
  {
    path: '/room/:roomId',
    component: () => import('client/views/RoomView.vue'),
    beforeEnter: () => {
      const roomInfo = useSocketStore().state.roomInfo
      if (roomInfo?.gameInfo) {
        return `/game/${roomInfo.type}`
      }
      return true
    },
    meta: {
      order: 1,
      transition: ''
    }
  },
  {
    path: '/game/:gameType',
    component: () => import('client/views/GameView.vue'),
    beforeEnter: (to) => {
      const gameType = to.params.gameType as string
      const game = useSocketStore().state.globalInfo.games.find((g) => g.type === gameType)
      return Boolean(game) && Boolean(useSocketStore().state.roomInfo?.gameInfo)
    },
    meta: {
      order: 2,
      transition: ''
    }
  },
];

export const router = createRouter({
  routes,
  history: createMemoryHistory(),
});

router.beforeEach(async (to) => {
  try {
    await useSocketStore().connect;
  } catch (error) {
    console.log(error)
  }
  return true
});

router.afterEach((to, from) => {
  if (to.path === from.path) {
    to.meta.transition = ''
    return
  }
  const toDepth = to.meta.order as number
  const fromDepth = from.meta.order as number
  to.meta.transition = toDepth > fromDepth ? 'slide-right' : 'slide-left'
})