const Sequelize = require('sequelize');

const sequelize = new Sequelize('test', 'root', 'Zelensky', {

    dialect: 'mysql',
    host: 'localhost'
    }
);

module.exports = sequelize;