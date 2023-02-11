let Sequelize = require('sequelize');

let sequelize = new Sequelize('expensetrackerapp' , 'root' , '1qaz2wsx3edc',{
    dialect:'mysql',
    host:'localhost'
});

module.exports = sequelize ;