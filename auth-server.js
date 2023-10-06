const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs');
const db = require('./db.json');

const cors = require("cors")

const app = express();
const port = 3000;
const secretKey = 'thisisnotarealsecretkey';

app.use(bodyParser.json());
app.use(cors())

app.post('/signup', (req, res) => {
  const { fullName,email, password } = req.body;

  const userExists = db.users.find((user) => user.email === email);

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    id: db.users.length + 1,
    fullName,
    email,
    password, // In a real app, hash and salt the password before saving it.
  };

  db.users.push(newUser);
  fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
  const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

  res.status(200).json({ token });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = db.users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

  res.status(200).json({ token });
});

app.listen(port, () => {
  console.log(`Authentication server is running on http://localhost:${port}`);
});
