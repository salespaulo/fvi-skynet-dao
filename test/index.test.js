'use strict'

const fs = require('fs')
const path = require('path')

const chai = require('chai')

const app = require('../src')

describe(`Testing app mock=true`, () => {
    const dirName = path.join(__dirname, '.data', '/')
    const modelId = 'model-testing'
    const mock = {
        onDownloadIndexes: skylink => {
            return fs.createReadStream(dirName + skylink.slice(6))
        },
        onDownloadItem: (propId, skylink) => {
            return fs.createReadStream(dirName + skylink.slice(6))
        },
        onUploadIndexes: indexes => {
            const newskylink = 'Idx_' + Math.random() + '.json'
            fs.writeFileSync(path.join(dirName, newskylink), JSON.stringify(indexes))
            return {
                skylink: newskylink,
            }
        },
        onUploadItem: (propId, idxs, currentIdxSkylink, data) => {
            const newskylink = currentIdxSkylink
                ? 'Item_' + currentIdxSkylink.slice(6) + Math.random() + '.json'
                : 'Item_' + Math.random() + '.json'
            fs.writeFileSync(path.join(dirName, newskylink), JSON.stringify(data))

            return {
                skylink: newskylink,
            }
        },
    }
    let options = null

    before(() => {
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, { recursive: true })
        }
    })

    after(() => {
        if (fs.existsSync(dirName)) {
            fs.readdirSync(dirName).forEach(f => fs.unlinkSync(path.join(dirName, '/', f)))
        }
    })

    beforeEach(() => {
        options = {
            mock,
            modelId,
            indexes: {
                propId: 'myId',
                idxs: ['email', 'status'],
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

        try {
            app(options)
            done('Should be throw an error!')
        } catch (e) {
            chai.assert.exists(e)
            chai.assert.isTrue(e.message.includes('"modelId"'))
            done()
        }
    })

    it(`Initialization - OK`, done => {
        app(options)
        done()
    })

    describe(`Testing functions`, () => {
        let dao = null
        let data = null
        let skylinkItem = null

        before(() => {
            dao = app(options)
            data = { email: 'test@test.com', status: true, desc: 'Testing DAO' }
        })

        it(`Testing create one`, done => {
            dao.create(data)
                .then(res => {
                    chai.assert.exists(res)
                    chai.assert.exists(res.item)
                    chai.assert.exists(res.item.myId)
                    chai.assert.exists(res.item.email)
                    chai.assert.exists(res.item.status)
                    chai.assert.exists(res.item.desc)
                    chai.assert.exists(res.item.skylink)
                    chai.assert.exists(res.item._versions)
                    chai.assert.exists(res.indexes)
                    chai.assert.exists(res.indexes.skylink)
                    skylinkItem = res.item.skylink
                    done()
                })
                .catch(done)
        })

        it(`Testing read one`, done => {
            dao.read(skylinkItem)
                .then(res => {
                    chai.assert.exists(res)
                    chai.assert.exists(res.myId)
                    chai.assert.exists(res._versions)
                    done()
                })
                .catch(done)
        })

        it(`Testing read one and update, creates new one version`, done => {
            dao.read(skylinkItem)
                .then(res => {
                    res.status = false
                    chai.assert.exists(res.myId)
                    chai.assert.exists(res._versions)
                    return dao.create(res)
                })
                .then(res => {
                    chai.assert.exists(res)
                    chai.assert.exists(res.item)
                    chai.assert.exists(res.item.skylink)
                    chai.assert.exists(res.item._versions)
                    chai.assert.exists(res.indexes)
                    chai.assert.exists(res.indexes.skylink)
                    skylinkItem = res.indexes.skylink
                    done()
                })
                .catch(done)
        })

        it(`Testing read idxs`, done => {
            dao.indexes()
                .then(res => {
                    chai.assert.exists(res)
                    chai.assert.exists(res.values)
                    chai.assert.isArray(res.values)
                    chai.assert.exists(res._versions)
                    chai.assert.isArray(res._versions)
                    done()
                })
                .catch(done)
        })

        it(`Testing read all`, done => {
            dao.indexes()
                .then(res => {
                    chai.assert.exists(res.values)
                    chai.assert.isArray(res.values)
                    chai.assert.exists(res._versions)
                    chai.assert.isArray(res._versions)
                    done()
                })
                .catch(done)
        })

        it(`Testing read with filter email`, done => {
            dao.indexes()
                .then(res => {
                    chai.assert.exists(res)
                    chai.assert.isArray(res.values)
                    chai.assert.exists(res._versions)
                    chai.assert.isArray(res._versions)
                    done()
                })
                .catch(done)
        })
    })
})
