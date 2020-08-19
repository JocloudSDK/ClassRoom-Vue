const webpackMain = require('electron-webpack/webpack.main.config.js')

const isProd = process.env.ENV === 'production'
webpackMain().then(config => {
  config.devtool = isProd ? 'source-map' : 'cheap-module-eval-source-map'
  config.plugins = {
    ...config.plugins,
    'thunderbolt-electron-sdk': 'commonjs2 thunderbolt-electron-sdk'
  }
  config.externals = {
    ...config.externals,
    'thunderbolt-electron-sdk': 'commonjs2 thunderbolt-electron-sdk'
  }
})
