
const {postgreSqlUrl} = require('./../config/dbConfig')
const pgp = require('pg-promise')();


const pgpObj = pgp({
  connectionString: postgreSqlUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});


const connectDB = async () => {
  try {
    await pgpObj.query('SELECT NOW()');
    console.log('PostgreSQL Connected Successfully');
  } catch (error) {
    console.error('Database Connection Error', error);
    process.exit(1);
  }
};

module.exports = { pgpObj, connectDB };
