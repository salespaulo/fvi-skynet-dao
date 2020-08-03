'use strict'

const { stringToFileStream } = require('./streams')
const { setMockUploadIdxs } = require('./utils')

const uploadIdxs = (client, mock) => indexes => {
    try {
        setMockUploadIdxs(client, indexes, mock)

        if (indexes._versions == null || !indexes._versions instanceof Array) {
            throw new Error(
                `Error uploading indexes=${
                    indexes.skylink
                } property "_versions" is invalid format! Type of "Array" is not type of "_versions=${typeof indexes._versions}"`
            )
        }

        if (indexes.skylink) {
            indexes._versions.push(indexes.skylink)
        }

        const stream = stringToFileStream(JSON.stringify(indexes))
        return client.uploadFile(stream).then(res => res.data)
    } catch (e) {
        e.message = `Error uploading indexes from indexes=${JSON.stringify(indexes)}; error=${
            e.message
        }!`
        throw e
    }
}

module.exports = uploadIdxs
