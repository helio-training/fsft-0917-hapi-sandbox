require('babel-polyfill')

const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// module.exports = require('./build');

if (env === 'production') {
  module.exports = require('./build')
} else {
  require('babel-register')
  module.exports = require('./src')
}
