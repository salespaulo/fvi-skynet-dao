'use strict'

const skynet = require('fvi-skynet-client')

const uploadItem = require('./upload-item')
const uploadIdxs = require('./upload-idxs')

const downloadItem = require('./download-item')
const downloadIdxs = require('./download-idxs')

module.exports = options => {
    options.indexes.values = []

    const client = skynet({ mock: options.mock != null })
    const propId = options.indexes.propId
    const idxs = options.indexes.idxs

    const instance = {
        downloadIndexes: downloadIdxs(client, options.mock),
        uploadIndexes: uploadIdxs(client, options.mock),
        downloadItem: downloadItem(client, propId, options.mock),
        uploadItem: uploadItem(client, propId, idxs, options.mock),
        options,
    }

    return instance
}
