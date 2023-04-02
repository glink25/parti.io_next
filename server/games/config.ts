import { Games } from "shared/config";
import { GandengyanGame } from "./gandengyan";
import { JinziqiGame } from "./jinziqi";

export const GameConfig = {
    'jinziqi': JinziqiGame,
    'gandengyan': GandengyanGame

} satisfies Record<Games, any>