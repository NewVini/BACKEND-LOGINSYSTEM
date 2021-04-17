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
  },

  async validate(req, res) {
    try {
      if (req.body) {
        const token = jwt.verify(req.body.token)
        if (token) {
          return res.send(true)
        }
        return res.status(400).json({ err: 'error on token' })
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }
  }
}