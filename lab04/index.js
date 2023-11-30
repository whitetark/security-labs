const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;
const { login, register, refresh } = require('./auth');
const { auth } = require('express-oauth2-jwt-bearer');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const checkJwt = auth({
  audience: 'https://kpi.eu.auth0.com/api/v2',
  issuerBaseURL: 'https://kpi.eu.auth0.com',
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const access = await login(username, password);

  if (access) {
    res.json(access);
  }
  res.status(401).send();
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const user = await register(username, password);
  if (user) {
    return res.json(user);
  }
  return res.status(500).send();
});

app.get('/api/private', checkJwt, async (req, res) => {
  return res.json({
    message: 'Message for authorized members!',
  });
});

app.post('/api/token', async (req, res) => {
  const { refreshToken } = req.body;
  const result = await refresh(refreshToken);
  if (result) {
    return res.json({
      accessToken: result.access_token,
    });
  }
  return res.status(500).send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
