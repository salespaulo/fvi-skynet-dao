'use strict'

const { StringWritable } = require('./streams')
const { setMockDownloadItem, setItemDefaults } = require('./utils')

const downloadItem = (client, propId, mock) => skylink =>
    new Promise((resolve, reject) => {
        setMockDownloadItem(client, propId, skylink, mock)
        const stream = new StringWritable()

        stream.on('finish', () => {
            const data = JSON.parse(stream.content)
            return resolve(setItemDefaults(propId, skylink, data))
        })

        stream.on('error', e => {
            reject(e)
        })

        client
            .download(skylink)
            .then(res => res.data)
            .then(data => data.pipe(stream))
            .catch(e =>
                reject(
                    new Error(
                        `Error downloading indexes from skylink=${skylink}; error=${e.message}!`
                    )
                )
            )
    })

module.exports = downloadItem
