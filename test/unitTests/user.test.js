const { describe, it, before, afterEach } = require('mocha')
const sinon = require('sinon')
const { expect } = require('chai')

const userController = require('./../../src/controllers/user')
const { User: userModel } = require('./../../src/models')

describe('UserController Suite tests', () => {
  let sandbox

  before(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should register a user in database given name, username, password and phone fields', async () => {
    const req = {
      body: {
        name: 'Angelo',
        username: 'angelo848',
        password: '123456',
        phone: '79988201744'
      }
    }
    const res = {
      send: sandbox.fake.returns('ok'),
    }

    sandbox.stub(userModel, userModel.create.name)
      .resolves(req.body)

    const expected = 'ok'
    const result = await userController.create(req, res)

    expect(result).to.be.deep.equal(expected)
  })

  it('should return error when not passing name', async () => {
    const req = {
      body: {
        username: 'angelo848',
        password: '123456',
        phone: '79988201744'
      }
    }
    const res = {}
    res.status = sandbox.fake.returns(res)
    res.json = sandbox.stub().returnsArg(0)

    const expected = { error: 'Nome não preenchido' }
    const result = await userController.create(req, res)

    expect(result).to.be.deep.equal(expected)
  })
  it('should return error when not passing username', async () => {
    const req = {
      body: {
        name: 'Angelo',
        password: '123456',
        phone: '79988201744'
      }
    }
    const res = {}

    res.status = sandbox.fake.returns(res)
    res.json = sandbox.stub().returnsArg(0)

    const expected = { error: 'Usuário não preenchido' }
    const result = await userController.create(req, res)

    expect(result).to.be.deep.equal(expected)
  })
  it('should return error when not passing password', async () => {
    const req = {
      body: {
        name: 'Angelo',
        username: 'angelo848',
        phone: '79988201744'
      }
    }
    const res = {}

    res.status = sandbox.fake.returns(res)
    res.json = sandbox.stub().returnsArg(0)

    const expected = { error: 'Senha não preenchida' }
    const result = await userController.create(req, res)

    expect(result).to.be.deep.equal(expected)
  })
  it('should return error when not passing phone', async () => {
    const req = {
      body: {
        name: 'Angelo',
        username: 'angelo848',
        password: '123456',
      }
    }
    const res = {}

    res.status = sandbox.fake.returns(res)
    res.json = sandbox.stub().returnsArg(0)

    const expected = { error: 'Telefone não preenchido' }
    const result = await userController.create(req, res)

    expect(result).to.be.deep.equal(expected)
  })
})