const express = require('express')
const whatsApp = require('./controllers/whatsapp')

const routes = express.Router()

routes.post('/send-message', whatsApp.sendMessage)
routes.get('/connect', whatsApp.connect)

module.exports = routes