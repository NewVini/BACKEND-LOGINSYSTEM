const { describe, it, before, afterEach } = require('mocha')
const sinon = require('sinon')
const { expect } = require('chai')

const jwt = require('./../../src/utils/jwt')
const sessionController = require('./../../src/controllers/session')
const { User: userModel } = require('./../../src/models')
const userMock = require('./../mocks/userMock.json')

describe('SessionController Suite Tests', () => {
  let sandbox

  before(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should login when passing username and password', async () => {
    const req = {
      body: {
        username: 'angelo848',
        password: '123456'
      }
    }
    const res = {}
    res.json = sandbox.stub().returnsArg(0)

    sandbox.stub(userModel, userModel.findOne.name)
      .resolves(userMock)

    const mockToken = 'SECRET_TOKEN_JWT'
    sandbox.stub(jwt, jwt.sign.name)
      .returns(mockToken)

    const expected = {
      token: mockToken
    }
    const result = await sessionController.create(req, res)

    expect(result).to.be.deep.equal(expected)
  })

  it('should return error when not passing username', async () => {
    const req = {
      body: {
        password: '123456'
      }
    }
    const res = {}
    res.status = sandbox.fake.returns(res)
    res.json = sandbox.stub().returnsArg(0)

    const expected = { error: 'Preencha o usuário' }
    const result = await sessionController.create(req, res)

    expect(result).to.be.deep.equal(expected)
  })

  it('should return error when not passing password', async () => {
    const req = {
      body: {
        username: 'angelo848'
      }
    }
    const res = {}
    res.status = sandbox.fake.returns(res)
    res.json = sandbox.stub().returnsArg(0)

    const expected = { error: 'Preencha a senha' }
    const result = await sessionController.create(req, res)

    expect(result).to.be.deep.equal(expected)
  })
})