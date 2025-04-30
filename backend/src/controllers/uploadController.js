
const { validateFreightData } = require('../validations/freights/freightRateValidation');
const ExcelJS = require('exceljs');
const { parseFile } = require('../utils/fileParser');



const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: { code: 'NO_FILE', message: 'No file uploaded' } });
        }

        const { buffer, mimetype } = req.file;

        const parsedData = await parseFile(buffer, mimetype);
        res.status(200).json({
            success: true,
            message: 'File uploaded and parsed successfully',
            data: parsedData,
        });

        // Do your validation, mapping, and database saving with parsedData
        console.log('Parsed Data:', parsedData);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);

        const worksheet = workbook.worksheets[0];
        const rows = [];

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header
            rows.push({
                origin: row.getCell(1).text.trim(),
                destination: row.getCell(2).text.trim(),
                rate: parseFloat(row.getCell(3).value),
                currency: row.getCell(4).text.trim(),
                valid_from: row.getCell(5).text.trim(),
                valid_to: row.getCell(6).text.trim(),
            });
        });

        const validRows = [];
        const invalidRows = [];

        rows.forEach((row, index) => {
            const { valid, errors } = validateFreightData(row);
            if (valid) {
                validRows.push(row);
            } else {
                invalidRows.push({
                    row: index + 2, // (since row 1 is headers)
                    errors,
                });
            }
        });

        // Insert only valid rows
        const insertQueries = validRows.map(row =>
            db.none(
                `INSERT INTO freight_rates (origin, destination, rate, currency, valid_from, valid_to)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (origin, destination, valid_from)
         DO UPDATE SET rate = EXCLUDED.rate, currency = EXCLUDED.currency, valid_to = EXCLUDED.valid_to`,
                [
                    row.origin,
                    row.destination,
                    row.rate,
                    row.currency,
                    row.valid_from,
                    row.valid_to,
                ]
            )
        );

        await Promise.all(insertQueries);

        res.status(200).json({
            message: 'Upload processed',
            inserted: validRows.length,
            errors: invalidRows,
        });

    } catch (error) {
        console.error('Upload Error:', error);

        if (error.message.includes('Only .xlsx and .csv files are allowed')) {
            return res.status(400).json({ message: error.message });
        }

        if (error.message.includes('File too large')) {
            return res.status(400).json({ message: 'File size exceeds 5MB limit' });
        }

        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { uploadFile };
