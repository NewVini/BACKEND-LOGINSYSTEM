const express = require('express')

const whatsAppController = require('./controllers/whatsapp')
const userController = require('./controllers/user')
const sessionController = require('./controllers/session')

const routes = express.Router()

routes.post('/whatsapp/send-message', whatsAppController.sendMessage)
routes.post('/whatsapp/send-csv', whatsAppController.csvMessages)
routes.get('/whatsapp/connect', whatsAppController.connect)

routes.post('/user/create', userController.create)

routes.post('/session/login', sessionController.create)
routes.post('/session/validate', sessionController.validate)

module.exports = routes