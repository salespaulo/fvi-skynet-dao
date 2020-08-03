'use strict'

const uploadIdxs = require('./upload-idxs')
const downloadIdxs = require('./download-idxs')

const { JSONReadable } = require('./streams')
const { setMockUploadItem, setItemDefaults } = require('./utils')

const uploadItem = (client, propId, idxs, mock) => currentSkylinkIdxs => async (data = {}) => {
    try {
        if (data[propId] == null) {
            data._versions = []
        } else if (data.skylink) {
            data._versions = [data.skylink]
        } else {
            throw new Error(
                `Error uploading item=${
                    data[propId]
                } without "skylink" property! _versions=${JSON.stringify(data._versions)}`
            )
        }

        setMockUploadItem(client, propId, idxs, currentSkylinkIdxs, data, mock)

        const stream = new JSONReadable(data)
        const resUpload = await client.uploadFile(stream)
        const item = setItemDefaults(propId, resUpload.data.skylink, data)

        const idxItem = { skylink: item.skylink }
        idxs.forEach(idx => (idxItem[idx] = data[idx]))

        const indexes = await downloadIdxs(client, mock)(currentSkylinkIdxs)
        indexes.values.push(idxItem)
        const { skylink } = await uploadIdxs(client, mock)(indexes)

        return {
            item,
            indexes: { skylink, values: indexes },
        }
    } catch (e) {
        e.message = `Error uploading item from indexes current skylink=${currentSkylinkIdxs}; error=${e.message}`
        throw e
    }
}

module.exports = uploadItem
