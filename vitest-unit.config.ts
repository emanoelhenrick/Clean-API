import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**\/*.spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      'data',
    ]
  }
})