const commonjs = require('@rollup/plugin-commonjs')
const vue = require('rollup-plugin-vue')
const typescript = require('rollup-plugin-typescript')

export default {
  input: 'src/MyComponent.vue',
  output: {
    format: 'esm',
    file: 'dist/MyComponent.js'
  },
  external: ['vue'],
  plugins: [
    commonjs(),
    typescript({
      tsconfig: false,
      experimentalDecorators: true,
      module: 'es2015'
    }),
    vue()
  ]
}
