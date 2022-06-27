const { Sequelize } = require('sequelize');
const { DATABASE_URL } = require('../util/config');

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection success.');
  } catch (error) {
    console.log('Failed to connect to the database.');
    return process.exit(1);
  };

  return null;
};

module.exports = {
  connectToDatabase,
  sequelize,
};
