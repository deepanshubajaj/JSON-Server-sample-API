const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, '../db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Optional: Custom routing (rewrite URLs)
server.use(jsonServer.rewriter({
  '/api/*': '/$1',
  '/product/:resource/:id/show': '/:resource/:id'
}));

server.use(router);

// Export the server as the Vercel function handler
module.exports = (req, res) => {
  server(req, res);
};
