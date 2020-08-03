'use strict'

const { Writable } = require('stream')
const stringToFileStream = require('string-to-file-stream')

class StringWritable extends Writable {
    constructor() {
        super()
        this.content = ''
    }

    write(chunk) {
        this.content += chunk.toString()
    }
}

module.exports = {
    StringWritable,
    stringToFileStream,
}
