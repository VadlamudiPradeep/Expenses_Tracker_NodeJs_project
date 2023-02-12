let Sequelize = require('sequelize');
let sequelize = require('../util/database');

let User = sequelize.define('expenses',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
    },
    expenses:Sequelize.INTEGER,
    description:Sequelize.STRING,
    category:Sequelize.STRING,
  
});

module.exports = User;