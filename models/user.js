let Sequelize = require('sequelize');
let sequelize = require('../util/database');

let User = sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
    },
    name:Sequelize.STRING,
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true,
    },
    phone:Sequelize.STRING,
    password:Sequelize.STRING,
});

module.exports = User;