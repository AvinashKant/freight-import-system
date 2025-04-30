// src/middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
  
    let statusCode = 500;
    let errorCode = 'SERVER_ERROR';
    let message = 'Something went wrong';
  
    // Handle Multer file upload errors
    if (err.code === 'LIMIT_FILE_TYPE') {
      statusCode = 400;
      errorCode = 'INVALID_FILE_TYPE';
      message = 'Only .xlsx and .csv files are allowed!';
    }
  
    if (err.code === 'LIMIT_FILE_SIZE') {
      statusCode = 400;
      errorCode = 'FILE_TOO_LARGE';
      message = 'File size exceeds the allowed limit!';
    }
  
    // Handle invalid JSON
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      statusCode = 400;
      errorCode = 'INVALID_JSON';
      message = 'Invalid JSON payload';
    }
  
    // You can add more specific error types here as needed!
  
    res.status(statusCode).json({
      success: false,
      error: {
        code: errorCode,
        message: message,
      },
    });
  };
  
  module.exports = errorHandler;
  