
const csv = require('csv-parser'); // Lightweight CSV parser
const { Readable } = require('stream');

const parseCSV = async (fileBuffer) => {
    const rows = [];

    const stream = Readable.from(fileBuffer);

    return new Promise((resolve, reject) => {
        stream
            .pipe(csv())
            .on('data', (row) => rows.push(row))
            .on('end', () => resolve(rows))
            .on('error', (error) => reject(error));
    });
};

module.exports = parseCSV;