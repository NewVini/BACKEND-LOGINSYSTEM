const express = require('express')

const whatsAppController = require('./controllers/whatsapp')
const userController = require('./controllers/user')
const sessionController = require('./controllers/session')

const routes = express.Router()

routes.post('/send-message', whatsAppController.sendMessage)
routes.get('/connect', whatsAppController.connect)

routes.post('/user/create', userController.create)

routes.post('/session/login', sessionController.create)

module.exports = routes