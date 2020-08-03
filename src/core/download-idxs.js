'use strict'

const { StringWritable } = require('./streams')
const { setMockDownloadIdxs } = require('./utils')
const { validateIndexes } = require('../validation')

const downloadIdxs = (client, mock) => skylink =>
    new Promise((resolve, reject) => {
        if (skylink == null) {
            return resolve({ skylink })
        }

        setMockDownloadIdxs(client, skylink, mock)
        const stream = new StringWritable()

        stream.on('finish', () => {
            const data = JSON.parse(stream.content)
            return resolve({ ...data, skylink })
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
    }).then(data => validateIndexes(data))

module.exports = downloadIdxs
