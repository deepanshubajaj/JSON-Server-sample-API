// See https://github.com/typicode/json-server#module
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
// Add this before server.use(router)
server.use(jsonServer.rewriter({
    '/api/*': '/$1',           // General route handling for all API requests
    '/product/:resource/:id/show': '/:resource/:id', // Custom route for products (if needed)
    '/api/cafes': '/cafes', // Handling cafes requests
    '/api/cafes/:id': '/cafes/:id', // Handling specific cafe by ID
    '/api/users': '/users',  // Handling users requests
    '/api/users/:id': '/users/:id', // Handling specific user by ID
}))
server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
})

// Export the Server API
module.exports = server