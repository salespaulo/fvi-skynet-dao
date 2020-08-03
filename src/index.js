'use strict'

const Client = require('./client')
const { validateOpts } = require('./validation')

class Model {
    constructor(client) {
        this._client = client
        this._options = client.options
        this._updateIdxs(client.options.indexes.skylink)
    }

    async create(data) {
        const item = await this._uploadItem(data)
        this._updateIdxs(item.indexes.skylink)
        return item
    }

    async readIndexes() {
        const skylink = this._options.indexes.skylink
        const data = await this._client.downloadIndexes(skylink)
        return data
    }

    async readItem(skylink) {
        const indexes = await this.readIndexes()
        const hasItem = indexes.find(idx => idx.skylink === skylink)

        if (hasItem == null) {
            throw new Error(`Item not found in indexes=${JSON.stringify(indexes)}!`)
        }

        const data = await this._client.downloadItem(skylink)
        return data
    }

    _updateIdxs(skylink) {
        this._options.indexes.skylink = skylink
        this._uploadItem = this._client.uploadItem(skylink)
    }
}

module.exports = async (opts = {}) => {
    const options = validateOpts(opts)
    const client = await Client(options)
    const model = new Model(client)

    return model
}
