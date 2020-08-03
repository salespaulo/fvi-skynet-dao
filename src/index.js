'use strict'

const Model = require('./model')
const Core = require('./core')
const { validateOpts } = require('./validation')

module.exports = (opts = {}) => {
    const options = validateOpts(opts)
    const core = Core(options)
    const model = new Model(core)

    return model
}
