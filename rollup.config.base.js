// 处理第三方库加载引入
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
// 支持加载commonjs规范
import commonjs from '@rollup/plugin-commonjs'
import replace from 'rollup-plugin-replace'
// 加载json文件如：package
import json from '@rollup/plugin-json'
export default {
  input: './src/index.js',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    resolve(),
    commonjs(),
    json(),
    babel({
      babelHelpers: 'runtime', // 构建js包使用runtime
      exclude: 'node_modules/**'
    })
  ]
}
