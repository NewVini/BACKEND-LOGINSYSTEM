const express = require('express')
const consign = require('consign')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

consign({ cwd: 'src' })
  .include('utils')
  .then('controllers')
  .then('routes.js')
  .into(app)

app.listen(3000, () => {
  console.log('app running at port 3000')
})
