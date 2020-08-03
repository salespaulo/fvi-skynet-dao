'use strict'

const joi = require('@hapi/joi')

const returnValueOrThrows = schema => param => {
    const { value, error } = schema.validate(param)

    if (error == null) {
        return value
    }

    throw new Error(`Invalid input schema! errors=${JSON.stringify(error)}`)
}

const validateOpts = joi
    .object({
        modelId: joi.string().required(),
        mock: joi.boolean().optional(),
        ttl: joi.number().optional(),
        indexes: joi
            .object({
                propId: joi.string().optional(),
                skylink: joi.string().optional(),
                idxs: joi.array().optional(),
            })
            .options({ stripUnknown: true }),
    })
    .options({ stripUnknown: true })

module.exports = {
    validateOpts: returnValueOrThrows(validateOpts),
    validateIndexes: returnValueOrThrows(joi.array().required()),
    validateStringRequired: returnValueOrThrows(joi.string().required()),
}
