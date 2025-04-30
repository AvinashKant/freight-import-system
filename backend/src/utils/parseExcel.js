const ExcelJS = require('exceljs');

const parseExcel = async (fileBuffer) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);
    const worksheet = workbook.worksheets[0]; // First sheet only

    const rows = [];
    const headers = [];

    worksheet.getRow(1).eachCell((cell, colNumber) => {
        headers.push(cell.value);
    });

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row
        const rowData = {};
        headers.forEach((header, idx) => {
            rowData[header] = row.getCell(idx + 1).value;
        });
        rows.push(rowData);
    });

    return rows;
};
module.exports = parseExcel;