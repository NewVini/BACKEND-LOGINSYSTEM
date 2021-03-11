const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const puppeteer = require('puppeteer')

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(routes)

app.listen(3000, () => {
  console.log('app running at port 3000')
})
