import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import Vue from '@vitejs/plugin-vue';
import { presetIcons, presetWind, transformerDirectives } from 'unocss';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import { PORT } from '../shared/server';

const readJsonFile = async (path: string) =>
  JSON.parse(
    await readFile(resolve(__dirname, `./node_modules/${path}`), {
      encoding: 'utf-8',
    })
  );

export default defineConfig({
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
  ],
  resolve: {
    alias: {
      shared: resolve(__dirname, '../shared'),
      client: resolve(__dirname, '../client'),
      server: resolve(__dirname, '../server'),
    },
  },
  build: {
    outDir: resolve(__dirname, '../dist/client'),
  },
});
