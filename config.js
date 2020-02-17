// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    db_password: process.env.DB_PASSWORD,
    db_user: process.env.DB_USER,
    env_port: process.env.PORT
};