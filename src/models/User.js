import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../../config/database.js';

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },

  password: { type: DataTypes.STRING(255), allowNull: false },

  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user'
  },

  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },

  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.TEXT }
}, {
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 12);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

// instance method
User.prototype.validatePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default User;