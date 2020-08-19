const merge = require('webpack-merge')
const prodEnv = require('./prod.web.env')

module.exports = merge(prodEnv, {
  PORT: 8090,
  NODE_ENV: '"development"'
})
