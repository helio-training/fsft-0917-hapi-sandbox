import { Server } from 'hapi'
import Joi from 'joi'

const server = new Server()

const env = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 4000

server.connection({
  port,
  router: {
    isCaseSensitive: false,
  },
  routes: {
    cors: true,
  },
})

server.route({
  method: 'GET',
  path: '/orders',
  config: {
    tags: ['api'],
  },
  handler: async (request, reply) => {
    return reply([
      {
        id: 1,
        price: 10.99,
        isActive: true,
      },
    ])
  },
})

server.route({
  method: 'POST',
  path: '/orders',
  config: {
    tags: ['api'],
    validate: {
      payload: {
        price: Joi.number().min(0),
        isActive: Joi.bool().default(true),
      },
    },
  },
  handler: async (request, reply) => {
    const order = request.payload
    return reply(order)
  },
})

server.route({
  method: 'GET',
  path: '/orders/{id}',
  config: {
    tags: ['api'],
    validate: {
      params: {
        id: Joi.number().min(0),
      },
    },
  },
  handler: async (request, reply) => {
    const { id } = request.params

    return reply({
      id,
      price: 10.99,
      isActive: true,
    })
  },
})

server.register([
  require('inert'),
  require('vision'),
  require('blipp'),
  require('tv'),
  require('hapi-es7-async-handler'),
  {
    register: require('good'),
    options: {
      ops: {
        interval: 5000,
      },
      reporters: {
        console: [
          {
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{
              log: '*',
              response: '*', request: '*', error: '*',
            }],
          },
          {
            module: 'good-console',
          }, 'stdout'],
      },
    },
  },
  {
    register: require('hapi-swagger'),
    options: {
      cors: true,
      jsonEditor: true,
      documentationPath: '/',
      info: {
        title: 'Example',
        version: '1.0.0',
        description: 'An example api',
      },
    },
  },
], err => {
  if (err) throw err

  if (env !== 'testing') {
    server.start(err => {
      if (err) throw err
      server.log('info', 'Server running at: ' + server.info.uri)
    })
  }

})


export default server
