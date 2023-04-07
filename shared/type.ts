// import { Games } from "./config";

export type User = {
  name: string;
  uuid: string;
};

export type GameConfig = {
  server: string,
  index: string,
  cover: string,
  title: string,
  type: string
}

export type DeepPartial<T> = T extends object ? { [k in keyof T]?: T[k] extends object ? DeepPartial<T[k]> : T[k] } : T


export type GlobalInfo = {
  total: number;
  rooms: {
    id: string;
    available: boolean;
    type: string
  }[],
  hostURL: string,
  games: GameConfig[]
}
export type RoomInfo = {
  joiners: (User & { ready: boolean, online: boolean, admin: boolean })[]
  gameInfo?: any;
  id: string;
  type: string;
  ready: boolean
}

export type PartiClientState = {
  userInfo: User;
  globalInfo: GlobalInfo;
  roomInfo?: RoomInfo | null
}

export type ClientListenerMap = {
  'patch': (state: DeepPartial<PartiClientState>) => void
  'error': (msg: string) => void
}
export type ClientEmitMap = {
  'user:change-name': (name: string) => void
  'room:create': (gameType: string) => void
  'room:join': (roomId: string) => void
  'room:leave': () => void
  'room:kick-out': (roomId: string) => void
  'room:start': () => void
  'game:next': (...args: any) => void
}