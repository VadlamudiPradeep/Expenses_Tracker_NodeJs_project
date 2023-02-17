let Sequelize = require('sequelize');

require('dotenv').config();

let sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER ,'1qaz2wsx3edc' ,{
    dialect:'mysql',
    host:process.env.DB_HOST
});

module.exports = sequelize ;