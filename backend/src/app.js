const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const freightRoutes = require('./routes/freightRoutes');
const errorHandler = require('./middlewares/errorHandler');


const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Bad JSON:', err.message);
        return res.status(400).json({ message: 'Invalid JSON payload' });
    }
    next(err);
});


app.use('/api/freight', freightRoutes);
app.use(errorHandler);
module.exports = app;