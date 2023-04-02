export const GAME_TYPES = ['jinziqi', 'gandengyan'] as const

export type Games = typeof GAME_TYPES[number]

export type GameNext<T extends Record<string, any>> = (uuid: string, arg: T) => void