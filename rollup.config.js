import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

const Global = `var process = {
  env: {
    NODE_ENV: 'production'
  }
};
var module = {};`

export default {
  input: './lib/main.js',
  output: {
    file: 'build/bundle.js',
    format: 'iife',
    name: "test",
    banner: Global
  },
  watch: {
    include: 'lib/**'
  },
  plugins: [resolve(), commonjs()]
}