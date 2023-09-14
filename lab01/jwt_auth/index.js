const uuid = require('uuid')
const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const path = require('path')
const port = 3000

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const users = [
  {
    login: 'Sviat',
    password: '1111',
    username: 'Name',
  },
  {
    login: 'Sviat2',
    password: '2222',
    username: 'Name2',
  },
]

const SESSION_KEY = 'Authorization'

app.use((req, res, next) => {
  const sessionId = req.get(SESSION_KEY)
  let user = null

  if (sessionId) {
    const tokenData = jwt.verify(sessionId, `${process.env.TOKEN_KEY}`)

    if (tokenData) {
      user = users.find(
        (user) => user.login == tokenData.login && user.username == tokenData.username
      )
    }

    req.username = user ? user.username : null
    req.sessionId = sessionId
  }

  next()
})

app.get('/', (req, res) => {
  if (req.username) {
    return res.json({
      username: req.username,
      logout: 'http://localhost:3000/logout',
    })
  }
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/logout', (req, res) => {
  res.redirect('/')
})

app.post('/api/login', (req, res) => {
  const { login, password } = req.body

  const user = users.find((user) => {
    if (user.login == login && user.password == password) {
      return true
    }
    return false
  })

  if (user) {
    const token = jwt.sign(
      { login: user.login, username: user.username },
      `${process.env.TOKEN_KEY}`,
      { expiresIn: '2h' }
    )
    res.json({ token })
  }

  res.status(401).send()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
