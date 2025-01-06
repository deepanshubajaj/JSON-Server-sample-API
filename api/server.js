const jsonServer = require('json-server')
const path = require('path')
const fs = require('fs')

// Create a new JSON Server instance
const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, '../db.json')) // Ensure this path is correct for Vercel
const middlewares = jsonServer.defaults()

server.use(middlewares)

// Rewriting URLs (optional)
server.use(jsonServer.rewriter({
    '/api/*': '/$1',
    '/product/:resource/:id/show': '/:resource/:id'
}))

// Use the router (handles API requests)
server.use(router)

// Export the server as the Vercel serverless function handler
module.exports = (req, res) => {
  server(req, res)
}
