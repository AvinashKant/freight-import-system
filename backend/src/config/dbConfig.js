require('dotenv').config();
module.exports = {
    postgreSqlUrl: process.env.POSTGRESQL_DATABASE_URL,
};