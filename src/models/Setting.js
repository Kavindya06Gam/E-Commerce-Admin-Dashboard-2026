import User from './User.js';
import Category from './Category.js';
import Product from './Product.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Setting from './Setting.js';

// USER → ORDER
User.hasMany(Order, { foreignKey: 'UserId', onDelete: 'SET NULL' });
Order.belongsTo(User, { foreignKey: 'UserId' });

// CATEGORY → PRODUCT
Category.hasMany(Product, { foreignKey: 'CategoryId', onDelete: 'SET NULL' });
Product.belongsTo(Category, { foreignKey: 'CategoryId' });

// ORDER → ORDER ITEM
Order.hasMany(OrderItem, { foreignKey: 'OrderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'OrderId' });

// PRODUCT → ORDER ITEM
Product.hasMany(OrderItem, { foreignKey: 'ProductId', onDelete: 'SET NULL' });
OrderItem.belongsTo(Product, { foreignKey: 'ProductId' });

export {
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Setting
};