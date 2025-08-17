// @ts-check
import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'

export default defineConfig({
  site: 'https://academiajuvenil.progcomp.cl',
  integrations: [svelte()],
})
