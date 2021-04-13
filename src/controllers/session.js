const { User } = require('./../models')

const jwt = require('./../utils/jwt')

module.exports = {
  async create(req, res) {
    const { email, password } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Preencha o email' })
    }
    if (!password) {
      return res.status(400).json({ error: 'Preencha a senha' })
    }

    const user = await User.findOne({
      where: {
        email,
        password
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'Dados inválidos' })
    }

    const token = jwt.sign({ id: user.id })

    return res.json({ token })
  }
}