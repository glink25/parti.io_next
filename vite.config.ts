import { readFile, writeFile, readdir } from 'fs/promises';
import { resolve } from 'path';
import { exec } from "child_process";
import Vue from '@vitejs/plugin-vue';
import { presetIcons, presetWind, transformerDirectives } from 'unocss';
import UnoCSS from 'unocss/vite';
import { defineConfig, Plugin } from 'vite';
import { PORT } from './shared/server';
import { GameConfig } from 'shared/type';
import { pick } from './shared/merge';

const readJsonFile = async (path: string) =>
  JSON.parse(
    await readFile(resolve(__dirname, `./node_modules/${path}`), {
      encoding: 'utf-8',
    })
  );

const AfterPlugin = (fn: () => any): Plugin => {
  return {
    name: 'afterBuildPlugin',
    apply: 'build',
    writeBundle() {
      fn()
    },
  }
}

const getGameConfig = async () => {
  const GAMES_DIR = './games'
  return await readdir(resolve(__dirname, GAMES_DIR), { withFileTypes: true }).then(async (folders) => {
    return Promise.all(folders.filter(f => f.isDirectory()).map(async (folder, index) => {
      const configPath = resolve(__dirname, `${GAMES_DIR}/${folder.name}/config.json`)
      const configStr = await readFile(configPath, { encoding: 'utf-8' })

      const config = JSON.parse(configStr) as GameConfig
      return {
        ...config,
        type: folder.name,
        server: `./games/${folder.name}/${config.server.replace('.ts', ".js")}`,
        index: `/games/${folder.name}/${config.index}`,
        cover: `/games/${folder.name}/${config.cover}`,
        _rawServer: config.server,
        _rawCover: config.cover
      }
    }))
  })
}

export default defineConfig(async ({ mode }) => {
  const gameConfig = await getGameConfig()
  const input = Object.fromEntries(gameConfig.map((conf) => [conf.type, conf.index]))


  return {
    server: {
      port: PORT,
    },
    plugins: [
      Vue(),
      UnoCSS({
        presets: [
          presetWind(),
          presetIcons({
            collections: {
              material: () =>
                readJsonFile('@iconify-json/mdi/icons.json').then(
                  (i) => i.default
                ),
            },
          }),
        ],
        transformers: [transformerDirectives()],
      }),
      AfterPlugin(() => {
        gameConfig.forEach((conf) => {
          const { type, _rawCover, _rawServer } = conf
          exec(`esbuild ./games/${type}/${_rawServer} --bundle --platform=node --target=node12 --outfile=dist/games/${type}/${_rawServer.replace('.ts', '.js')}`)
          exec(`cp ./games/${type}/${_rawCover} dist/games/${type}/${_rawCover}`)
          writeFile(`dist/games/${type}/config.json`, JSON.stringify(pick(conf, ['type', 'title', 'server', 'index', 'cover'])), { encoding: 'utf-8' })
        })
      })
    ],
    resolve: {
      alias: {
        shared: resolve(__dirname, './shared'),
        client: resolve(__dirname, './client'),
        server: resolve(__dirname, './server'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          "index": resolve(__dirname, "./client/index.html"),
          ...input
        }
      },
      outDir: resolve(__dirname, './dist'),
    },
  }
});
