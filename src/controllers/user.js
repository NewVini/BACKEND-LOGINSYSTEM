const { User } = require('./../models')
const { v4: uuid } = require('uuid')

module.exports = {
  async create(req, res) {
    const { body } = req

    if (!body.name) {
      return res.status(400).json({ error: 'Nome não preenchido' })
    }
    if (!body.username) {
      return res.status(400).json({ error: 'Usuário não preenchido' })
    }
    if (!body.password) {
      return res.status(400).json({ error: 'Senha não preenchida' })
    }
    if (!body.phone) {
      return res.status(400).json({ error: 'Telefone não preenchido' })
    }

    await User.create({
      id: uuid(),
      ...body
    })

    return res.send('User created')
  }
}
