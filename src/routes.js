const { response } = require("express")

module.exports = (app) => {
  app.post('/', app.controllers.whatsapp.sendMessage)
}