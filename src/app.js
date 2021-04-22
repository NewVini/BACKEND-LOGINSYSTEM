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
  const token = authHeader && authHeader.split('Bearer')[1].trim()

  if (token == null) return res.status(401).send('INVALID-LOGIN')

  try {
    req.headers.user = jwt.verify(token)
  } catch (error) {
    return res.status(403).json({ error: 'Invalid authentication token' })
  }

  next()
})

app.use(routes)

app.listen(3001, () => {
  console.log('app running at port 3001')
})

// const puppeteer = require('puppeteer');
// (async () => {
//   const browser = await puppeteer.launch({ headless: false })
//   const page = await browser.newPage()
//   page.on('dialog', async dialog => {
//     await dialog.accept()
//   })
//   await page.goto('https://web.whatsapp.com')
//   await page.evaluate(() => {
//     localStorage.clear();
//     localStorage.setItem('WAToken1', JSON.stringify('31MxsFakHX7sCGk/FSKKIeAYff0Lvb7JFy69FSab1w0='))
//     localStorage.setItem('WAToken2', JSON.stringify('1@j+s0vLt2WlJyL5L4nBQppMneK7IBGTgeDzh5h+I1uHsnY1Hk6j1R8LztdsrukX8QYI2O72Z7kj+yxg=='))
//     localStorage.setItem('WABrowserId', JSON.stringify('S0XjOSUIFAHfujVepHl2bg=='))
//     localStorage.setItem('WASecretBundle', JSON.stringify({
//       key: '3JEv3IjJBZ4kMoDb7tra/LEDNTH3PiJcQaMGCSry1ls=',
//       encKey: 'zW7VEodBEdz4hvzR0P23r7GuLn7YFmtWTNuDyOh+tl4=',
//       macKey: '3JEv3IjJBZ4kMoDb7tra/LEDNTH3PiJcQaMGCSry1ls='
//     }))
//   })
//   await page.reload()
//   const search = await page.waitForSelector('.selectable-text')
//   await search.type('grupo 2')
//   await page.click('span[title="GRUPO 2"]')
//   const input = await page.waitForSelector('.copyable-area .copyable-text')
//   await input.type('mensagem teste')
//   await input.press('Enter')
// })()