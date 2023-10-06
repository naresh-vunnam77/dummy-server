const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const jwt = require('jsonwebtoken');

server.use(middlewares);

// Secure routes using JWT authentication
server.use('/api', (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  console.log(token)

  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  jwt.verify(token, 'thisisnotarealsecretkey', (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).json({ message: 'Authentication failed' });
    }

    res.status(200).json({ message: 'Access granted', user: decoded.username });
  });
});

server.use(router);

const port = 3001;
server.listen(port, () => {
  console.log(`JSON Server with Authentication is running on http://localhost:${port}`);
});
