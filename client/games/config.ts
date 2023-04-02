import { Games as GameTypes, GAME_TYPES } from "shared/config";
import type { Component } from "vue";
import GandengyanCover from "./gandengyan/cover.png?url";
import JInziqiCover from "./jinziqi/cover.png";

console.log(GandengyanCover)
export type GameInfo = {
    cover: string,
    title: string,
    gameComponent: () => Promise<Component>
}

export const GameConfig: Record<GameTypes, GameInfo> = {
    'jinziqi': {
        cover: JInziqiCover,
        title: 'Tic-Tac-Toe',
        gameComponent: () => import("client/games/jinziqi/Jinziqi.vue")
    },
    'gandengyan': {
        cover: GandengyanCover,
        title: 'Gandengyan',
        gameComponent: () => import("client/games/gandengyan/Gandengyan.vue")
    }
}

export const Games = GAME_TYPES.map(type => ({ type, ...GameConfig[type] ?? {} }) as GameInfo & { type: GameTypes })