export const GameSenderKey = Symbol.for('GameSenderKey')

export type Sender<T extends Record<string, any>> = (arg: T) => void