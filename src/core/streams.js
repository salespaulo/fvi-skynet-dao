'use strict'

const { Readable, Writable } = require('stream')

class StringWritable extends Writable {
    constructor() {
        super()
        this.content = ''
    }

    write(chunk) {
        this.content += chunk.toString()
    }
}

class JSONReadable extends Readable {
    construct(obj) {
        this.push(JSON.stringify(obj))
        this.push(null)
    }
}

module.exports = {
    JSONReadable,
    StringWritable,
}
