import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('mysql://root:1234@127.0.0.1:3306/actechweb', {
  host: '127.0.0.1',
  port: 3306,
  dialect: 'mysql',
  logging: false, // Set to console.log to see SQL queries
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;
