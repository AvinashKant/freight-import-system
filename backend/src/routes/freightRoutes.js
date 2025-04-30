const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../controllers/uploadController');
const { saveFreightData,getAll } = require('../controllers/freightController');

const router = express.Router();
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'text/csv', // .csv
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const error = new Error('Only .xlsx and .csv files are allowed!');
        error.code = 'LIMIT_FILE_TYPE'; 
        cb(error);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter,
});


router.post('/upload', upload.single('file'), uploadFile);
router.post('/', saveFreightData);
router.get('/', getAll);


module.exports = router;
