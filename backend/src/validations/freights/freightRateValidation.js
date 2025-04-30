const Joi = require('joi');

const freightRatesSchema = Joi.object({
    origin_country: Joi.string().required(),
    destination_country: Joi.string().required(),
    container_type: Joi.string().required(),
    carrier: Joi.string().required(),
    freight_rate: Joi.number().positive().required()
});

module.exports = { freightRatesSchema };
