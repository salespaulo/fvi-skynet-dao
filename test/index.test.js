'use strict'

const chai = require('chai')

const app = require('../src')

describe(`Testing app mock=true`, () => {
    const mock = true
    const modelId = 'model-testing'
    const ttl = 200
    let options = null

    beforeEach(() => {
        options = {
            mock,
            modelId,
            ttl,
            indexes: {
                propId: 'myId',
                idxs: ['username', 'status'],
            },
        }
    })

    it(`Initialization - app`, done => {
        chai.assert.exists(app)
        chai.assert.isFunction(app)
        done()
    })

    it(`Initialization - NOK - without modelId`, done => {
        delete options.modelId

        app(options)
            .then(() => done('Should be throw an error!'))
            .catch(e => {
                chai.assert.exists(e)
                chai.assert.isTrue(e.message.includes('"modelId"'))
                done()
            })
    })

    it(`Initialization - OK`, done => {
        app(options)
            .then(res => {
                chai.assert.exists(res)
                done()
            })
            .catch(done)
    })

    describe(`Testing functions`, () => {
        let dao = null
        let skylinkItem = null
        const data = { username: 'test1', status: true, desc: 'Descr 1' }

        before(async () => {
            dao = await app(options)
        })

        it(`Testing create one`, done => {
            dao.create(data)
                .then(res => {
                    chai.assert.exists(res)
                    chai.assert.exists(res.item)
                    chai.assert.exists(res.item.myId)
                    chai.assert.exists(res.item.username)
                    chai.assert.exists(res.item.status)
                    chai.assert.exists(res.item.desc)
                    chai.assert.exists(res.item.skylink)
                    chai.assert.exists(res.indexes)
                    chai.assert.exists(res.indexes.skylink)
                    skylinkItem = res.item.skylink
                    done()
                })
                .catch(done)
        })

        it(`Testing create one`, done => {
            data.username = 'paulo'
            dao.create(data)
                .then(res => {
                    chai.assert.exists(res)
                    chai.assert.exists(res.item)
                    chai.assert.exists(res.item.myId)
                    chai.assert.exists(res.item.username)
                    chai.assert.exists(res.item.status)
                    chai.assert.exists(res.item.desc)
                    chai.assert.exists(res.item.skylink)
                    chai.assert.exists(res.indexes)
                    chai.assert.exists(res.indexes.skylink)
                    skylinkItem = res.item.skylink
                    done()
                })
                .catch(done)
        })

        it(`Testing read one`, done => {
            dao.readItem(skylinkItem)
                .then(res => {
                    chai.assert.exists(res)
                    chai.assert.exists(res.myId)
                    done()
                })
                .catch(done)
        })

        it(`Testing read idxs`, done => {
            dao.readIndexes()
                .then(res => {
                    chai.assert.exists(res)
                    chai.assert.isArray(res)
                    done()
                })
                .catch(done)
        })

        it(`Testing read all`, done => {
            dao.readIndexes()
                .then(res => {
                    chai.assert.exists(res)
                    chai.assert.isArray(res)
                    done()
                })
                .catch(done)
        })

        it(`Testing read with filter username`, done => {
            dao.readIndexes()
                .then(res => {
                    chai.assert.exists(res)
                    chai.assert.isArray(res)
                    done()
                })
                .catch(done)
        })
    })
})
