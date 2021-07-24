import path from 'path'
import filesize from 'rollup-plugin-filesize' // 输出查看文件大小
import { uglify } from 'rollup-plugin-uglify' // 压缩混淆
import { minify } from 'uglify-es'
import { name, version, author } from './package.json'
import baseConfig from './rollup.config.base'
// banner
const banner =
    `${'/*!\n' + ' * '}${name}.js v${version}\n` +
    ` * (c) 2020-${new Date().getFullYear()} ${author}\n` +
    ` * Released under the MIT License.\n` +
    ` */`
const prodConfig = {
  ...baseConfig,
  output: [
    {
      file: path.resolve(__dirname, `./public/js/${name}.min.js`),
      format: 'umd',
      name,
      banner
    },
    {
      file: path.resolve(__dirname, `./public/js/${name}.cjs.js`),
      format: 'cjs',
      banner,
      exports: 'default'
    },
    {
      file: path.resolve(__dirname, `./public/js/${name}.esm.js`),
      format: 'es',
      banner
    }
  ],
  plugins: [
    ...baseConfig.plugins,
    uglify(
      {
        compress: {
          drop_console: true
        }
      },
      minify
    ),
    filesize()
  ]
}
export default prodConfig
