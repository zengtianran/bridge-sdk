import path from 'path'
import serve from 'rollup-plugin-serve'
import { name } from './package.json'
import baseConfig from './rollup.config.base'
export default {
  ...baseConfig,
  output: {
    file: path.resolve(__dirname, `./public/js/${name}.js`),
    format: 'umd',
    name,
    sourcemap: true
  },
  plugins: [
    ...baseConfig.plugins,
    serve({
      // open: true, // 运行自动浏览器打开
      outPage: path.resolve(__dirname, './public/index.html'),
      port: 2324,
      contentBase: ''
    })
  ]
}
