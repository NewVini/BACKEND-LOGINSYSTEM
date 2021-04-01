const { User } = require('./../models')

const jwt = require('./../utils/jwt')

module.exports = {
  async create(req, res) {
    const { username, password } = req.body

    if (!username) {
      return res.status(400).json({ error: 'Preencha o usuário' })
    }
    if (!password) {
      return res.status(400).json({ error: 'Preencha a senha' })
    }

    const user = await User.findOne({
      where: {
        username,
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