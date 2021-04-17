const jwt = require('jsonwebtoken')

module.exports = {
  verify(token) {
    const user = jwt.verify(token, process.env.TOKEN_SECRET)

    return user
  },

  sign: (payload) => {
    const token = jwt.sign(payload, process.env.TOKEN_SECRET)

    return token
  }
}