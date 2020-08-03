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
        mock: joi
            .object({
                onDownloadIndexes: joi.function().required(),
                onDownloadItem: joi.function().required(),
                onUploadIndexes: joi.function().required(),
                onUploadItem: joi.function().required(),
            })
            .optional()
            .default(null),
        indexes: joi
            .object({
                propId: joi.string().optional(),
                skylink: joi.string().optional(),
                idxs: joi.array().optional(),
            })
            .options({ stripUnknown: true }),
    })
    .options({ stripUnknown: true })

const validateIndexes = joi.object({
    skylink: joi.string().optional().default(null),
    values: joi.array().optional().default([]),
    _versions: joi.array().optional().default([]),
})

module.exports = {
    validateOpts: returnValueOrThrows(validateOpts),
    validateIndexes: returnValueOrThrows(validateIndexes),
    validateStringRequired: returnValueOrThrows(joi.string().required()),
}
