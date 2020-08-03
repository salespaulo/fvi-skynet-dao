'use strict'

const { Readable, Writable } = require('stream')

const skynet = require('fvi-skynet-client')
const { validateIndexes, validateStringRequired } = require('../validation')

class StringWritable extends Writable {
    constructor() {
        super()
        this.content = ''
    }

    write(chunk) {
        this.content += chunk.toString()
    }
}

const defaultsToItem = (propId, skylink, data) => {
    const indexId = validateStringRequired(skylink)
    const item = { ...data }
    item[propId] = indexId
    item.skylink = skylink
    return item
}

const downloadIndexes = client => skylink =>
    new Promise((resolve, reject) => {
        const stream = new StringWritable()

        stream.on('finish', () => {
            const data = JSON.parse(stream.content)

            if (client.mock) {
                return resolve([{ skylink }])
            }

            return resolve(validateIndexes(data))
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

const downloadItem = (client, propId) => skylink =>
    new Promise((resolve, reject) => {
        const stream = new StringWritable()

        stream.on('finish', () => {
            const data = JSON.parse(stream.content)

            if (client.mock) {
                return resolve(defaultsToItem(propId, skylink, data))
            }

            return resolve(defaultsToItem(propId, skylink, data))
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

const uploadIndexes = client => (indexes = []) => {
    try {
        const stream = new Readable()
        stream.push(JSON.stringify(indexes))
        stream.push(null)
        return client.uploadFile(stream).then(res => res.data)
    } catch (e) {
        throw new Error(
            `Error uploading indexes from indexes=${JSON.stringify(indexes)}; error=${e.message}!`
        )
    }
}

const uploadItem = (client, propId, idxs) => currentIdxSkylink => async (data = {}) => {
    try {
        if (data[propId] != null) {
            if (data._daoversions && typeof data._daoversions === 'array') {
                data._daoversions.push(data[propId])
            }
            data.versions = [data[propId]]
        }

        const stream = new Readable()
        stream.push(JSON.stringify(data))
        stream.push(null)

        const resUpload = await client.uploadFile(stream)
        const dataUploaded = resUpload.data
        const item = defaultsToItem(propId, dataUploaded.skylink, data)

        const idxItem = { skylink: dataUploaded.skylink }
        idxs.forEach(idx => (idxItem[idx] = data[idx]))

        const indexes = await downloadIndexes(client)(currentIdxSkylink)
        indexes.push(idxItem)
        const { skylink } = await uploadIndexes(client)(indexes)

        return {
            item,
            indexes: { skylink },
        }
    } catch (e) {
        throw new Error(
            `Error uploading item from indexes current skylink=${currentIdxSkylink}; error=${e.message}`
        )
    }
}

module.exports = async options => {
    const client = skynet({ mock: options.mock })

    const propId = options.indexes.propId
    const idxs = options.indexes.idxs

    const instance = {
        downloadIndexes: downloadIndexes(client),
        uploadIndexes: uploadIndexes(client),
        downloadItem: downloadItem(client, propId),
        uploadItem: uploadItem(client, propId, idxs),
    }

    let indexes = null

    if (options.indexes.skylink == null) {
        const resIdxs = await instance.uploadIndexes()
        const values = await instance.downloadIndexes(resIdxs.skylink)
        indexes = { skylink: resIdxs.skylink, values }
    } else {
        indexes = await instance.downloadIndexes(idxsSkylink)
    }

    options.indexes.skylink = indexes.skylink
    options.indexes.values = indexes.values

    return {
        ...instance,
        options,
    }
}
