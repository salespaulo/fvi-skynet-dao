'use strict'

class Model {
    constructor(client) {
        this._client = client
        this._options = client.options
    }

    async create(data) {
        const uploadItemFunc = this._client.uploadItem(this._options.indexes.skylink)
        const item = await uploadItemFunc(data)
        this._options.indexes.skylink = item.indexes.skylink
        return item
    }

    async read(skylink) {
        const indexes = await this.indexes()
        const hasItem = indexes.values.find(idx => idx.skylink === skylink)

        if (hasItem == null) {
            throw new Error(
                `Item not found to skylink=${skylink} in indexes=${JSON.stringify(indexes)}!`
            )
        }

        const data = await this._client.downloadItem(skylink)
        return data
    }
    async indexes() {
        const skylink = this._options.indexes.skylink
        const data = await this._client.downloadIndexes(skylink)
        return data
    }
}

module.exports = Model
