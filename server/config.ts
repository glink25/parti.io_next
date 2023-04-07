import { resolve } from "path";
import { readdir, readFile } from "fs/promises";
import { GameConfig } from "shared/type";

const GAMES_DIR = process.env.NODE_ENV === 'develop' ? '../games' : './games'

const gamesLoaded = readdir(resolve(__dirname, GAMES_DIR), { withFileTypes: true }).then(async (folders) => {
    return Promise.all(folders.filter(f => f.isDirectory()).map(async (folder, index) => {
        const configPath = resolve(__dirname, `${GAMES_DIR}/${folder.name}/config.json`)
        const configStr = await readFile(configPath, { encoding: 'utf-8' })

        const config = JSON.parse(configStr) as GameConfig
        const finalConfig = process.env.NODE_ENV === 'develop' ? {
            ...config,
            type: folder.name,
            server: `../games/${folder.name}/${config.server}`,
            index: `/games/${folder.name}/${config.index}`,
            cover: `/games/${folder.name}/${config.cover}`,
        } : config
        return finalConfig
    }))
})

export const getGameConfig = async () => await gamesLoaded