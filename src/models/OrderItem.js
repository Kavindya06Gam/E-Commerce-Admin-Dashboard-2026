import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const OrderItem = sequelize.define("OrderItem", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  quantity: { type: DataTypes.INTEGER, allowNull: false },
  unitPrice: { type: DataTypes.FLOAT, allowNull: false },
  subtotal: { type: DataTypes.FLOAT, allowNull: false },
});

export default OrderItem;
