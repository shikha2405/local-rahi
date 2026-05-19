'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {

      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 3,
      },

      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },

      phone: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },

      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      profile_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      gender: {
        type: Sequelize.ENUM('male', 'female', 'other'),
        allowNull: true,
      },

      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      pin_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      otp: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      otp_expiry: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      login_type: {
        type: Sequelize.ENUM('mobile', 'email', 'google'),
        defaultValue: 'mobile',
      },

      mobile_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      is_profile_completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      last_login_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      device_token: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      referral_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      referred_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      modified_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      modified_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },

    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('users');
  }
};
