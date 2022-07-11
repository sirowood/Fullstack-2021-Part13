const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class User extends Model {};

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: /[\S]+@[\S]+.[\S]+/i,
    }
  },

  password: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user'
});

module.exports = User;
