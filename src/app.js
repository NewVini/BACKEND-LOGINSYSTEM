const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

const routes = require('./routes')
const jwt = require('./utils/jwt')

dotenv.config()
const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use((req, res, next) => {
  const unauthenticatedRoutes = ['/session/login']
  if (unauthenticatedRoutes.includes(req.path)) {
    return next()
  }

  const authHeader = req.headers['authorization']
  if (!authHeader) return res.status(400).json({ error: 'Inexistent token' })
  const token = authHeader && authHeader.split(' ')[0]

  if (token == null) return res.status(401).send('INVALID-LOGIN')

  try {
    req.headers.user = jwt.verify(token)
  } catch (error) {
    return res.status(403).json({ error: 'Invalid authentication token' })
  }

  next()
})

app.use(routes)

app.listen(3000, () => {
  console.log('app running at port 3000')
})
