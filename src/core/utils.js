'use strict'

const { URI_SIA, DEFAULT_UPLOAD_URL, DEFAULT_DOWNLOAD_URL } = require('fvi-skynet-client/src/utils')

const { validateStringRequired } = require('../validation')

const setMockUploadItem = (client, propId, idxs, currentSkylinkIdxs, data, mock = false) => {
    if (mock) {
        const mockData = mock.onUploadItem(propId, idxs, currentSkylinkIdxs, data)
        client.mock.onPost(DEFAULT_UPLOAD_URL).reply(200, mockData)

        if (currentSkylinkIdxs != null) {
            const mockStream = mock.onDownloadIndexes(currentSkylinkIdxs)
            client.mock
                .onGet(`${DEFAULT_DOWNLOAD_URL}${currentSkylinkIdxs.slice(URI_SIA.length)}`)
                .reply(200, mockStream)
        }
    }
}

const setMockUploadIdxs = (client, indexes, mock = false) => {
    if (mock) {
        const mockData = mock.onUploadIndexes(indexes)
        client.mock.onPost(DEFAULT_UPLOAD_URL).reply(200, mockData)
    }
}

const setMockDownloadItem = (client, propId, skylink, mock = false) => {
    if (mock) {
        const mockData = mock.onDownloadItem(propId, skylink)
        client.mock
            .onGet(`${DEFAULT_DOWNLOAD_URL}${skylink.slice(URI_SIA.length)}`)
            .reply(200, mockData)
    }
}

const setMockDownloadIdxs = (client, skylink, mock = false) => {
    if (mock) {
        const mockStream = mock.onDownloadIndexes(skylink)
        client.mock
            .onGet(`${DEFAULT_DOWNLOAD_URL}${skylink.slice(URI_SIA.length)}`)
            .reply(200, mockStream)
    }
}

const setItemDefaults = (propId, skylink, data) => {
    const item = data
    const indexId = validateStringRequired(skylink)

    item[propId] = indexId.slice(URI_SIA.length)
    item.skylink = skylink

    return item
}

module.exports = {
    setMockUploadItem,
    setMockUploadIdxs,
    setMockDownloadItem,
    setMockDownloadIdxs,
    setItemDefaults,
}
