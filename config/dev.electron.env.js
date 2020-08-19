const merge = require('webpack-merge')
const prodEnv = require('./prod.electron.env')

module.exports = merge(prodEnv, {
  PORT: 8090,
  NODE_ENV: '"development"'
})
