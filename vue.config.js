const path = require('path')
const webpack = require('webpack')

const env = process.env.NODE_ENV === 'development'
  ? process.env.NODE_PLATFORM === 'electron'
    ? require('./config/dev.electron.env')
    : require('./config/dev.web.env')
  : process.env.NODE_PLATFORM === 'electron'
    ? require('./config/prod.electron.env')
    : require('./config/prod.web.env')

const isElectron = process.env.NODE_PLATFORM === 'electron'
const isProd = process.env.ENV === 'production'
const publicPath = process.env.NODE_ENV === 'development' ? '/' : './'
console.log('publicPath', publicPath)

module.exports = {
  publicPath: publicPath,
  productionSourceMap: false,
  pluginOptions: {
    'thunderbolt-electron-sdk': 'commonjs2 thunderbolt-electron-sdk'
  },
  chainWebpack: cf => {
    cf.module.rule('compile')
      .test(/\.js$/)
      .include
      .add(path.join(__dirname, 'src'))
      .end()
      .use('babel')
      .loader('babel-loader')
    cf.entry('app')
      .clear()
      .add('./src/renderer/main.js')
    cf.output
      .chunkFilename('js/[name]_[hash:8].js')
      .filename('js/[name]_[hash:8].js')
    cf.resolve.alias
      .set('@', path.join(__dirname, 'src/renderer'))
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': env
      })
    ],
    externals: {
      'thunderbolt-electron-sdk': 'commonjs2 thunderbolt-electron-sdk'
    }
  },
  devServer: {
    port: 8090,
    hot: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://testtoken.hummer.yy.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/netless_api': {
        target: 'https://cloudcapiv4.herewhite.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/netless_api': ''
        }
      },
      '/feedback': {
        target: 'https://imobfeedback.yy.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/feedback': ''
        }
      }
    }
  }
}
