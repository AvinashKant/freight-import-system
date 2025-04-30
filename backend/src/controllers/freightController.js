const { pgpObj } = require('../databases/pgp');
const { freightRatesSchema } = require('../validations/freights/freightRateValidation');
const Joi = require('joi');
const { successResponse } = require('../utils/response')

exports.saveFreightData = async (req, res, next) => {
    try {
        const freightData = req.body; 

        if (!Array.isArray(freightData) || freightData.length === 0) {
            return res.status(400).json({ message: 'Invalid or empty freight data!' });
        }
        const { error, value } = Joi.array().items(freightRatesSchema).validate(req.body, { abortEarly: false });
        const validFreightData = value;
        if (error) {
            return res.status(400).json({
                message: 'Validation failed',
                details: error.details.map(detail => detail.message)
            });
        }

        const insertQueries = validFreightData.map(item => {
            return pgpObj.none(
                `INSERT INTO freight_rates 
          (origin_country, destination_country, container_type, carrier, freight_rate)
         VALUES 
          (\${origin_country}, \${destination_country}, \${container_type}, \${carrier}, \${freight_rate})`,
                {
                    origin_country: item.origin_country,
                    destination_country: item.destination_country,
                    container_type: item.container_type,
                    carrier: item.carrier,
                    freight_rate: item.freight_rate
                }
            );
        });

        await Promise.all(insertQueries);

        return res.status(201).json(successResponse('Freight data saved successfully!'));

    } catch (error) {
        next(error);
    }
};

exports.getAll = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const offset = (page - 1) * pageSize;

        const freightRates = await pgpObj.any(
            `
        SELECT 
          *,
          COUNT(*) OVER() AS total_count
        FROM 
          freight_rates
        ORDER BY 
          created_at DESC
        LIMIT $1 OFFSET $2
        `,
            [pageSize, offset]
        );

        let totalRecords = 0;
        if (freightRates.length > 0) {
            totalRecords = parseInt(freightRates[0].total_count, 10);
        }

        /**
         * remove total_count from each record before sending to frontend
         */
        const cleanedData = freightRates.map(record => {
            const { total_count, ...rest } = record;
            return rest;
        });

        res.status(200).json(successResponse("Freight rates fetched successfully", cleanedData, {
            totalRecords,
            currentPage: page,
            pageSize,
            totalPages: Math.ceil(totalRecords / pageSize)
        }));
    } catch (error) {
        next(error);
    }
};