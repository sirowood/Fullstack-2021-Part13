const { DataTypes } = require('sequelize');

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('blogs');
        await queryInterface.dropTable('users');
    },
};