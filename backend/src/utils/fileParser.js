
const parseCSV = require('./parseCSV');
const parseExcel = require('./parseExcel');
/**
 * Parse uploaded file based on mimetype
 * @param {Buffer} fileBuffer 
 * @param {string} mimetype 
 * @returns {Promise<Array<Object>>}
 */
const parseFile = async (fileBuffer, mimetype) => {
    if (mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        return await parseExcel(fileBuffer);
    } else if (mimetype === 'text/csv') {
        return await parseCSV(fileBuffer);
    } else {
        throw new Error('Unsupported file format');
    }
};

module.exports = {
    parseFile,
};
