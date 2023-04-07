import { Games as GameTypes, GAME_TYPES } from "shared/config";
import type { Component } from "vue";

export type GameInfo = {
    html: string,
    title: string,
    gameComponent: () => Promise<Component>
}

export const GameConfig: Record<GameTypes, GameInfo> = {
    'jinziqi': {
        html: `<div>❌</div>
        <div>⭕</div>`,
        title: 'Tic-Tac-Toe',
        gameComponent: () => import("client/games/jinziqi/Jinziqi.vue")
    },
    'gandengyan': {
        html: `<div>❌👀</div>`,
        title: 'Gandengyan',
        gameComponent: () => import("client/games/gandengyan/Gandengyan.vue")
    }
}

export const Games = GAME_TYPES.map(type => ({ type, ...GameConfig[type] ?? {} }) as GameInfo & { type: GameTypes })