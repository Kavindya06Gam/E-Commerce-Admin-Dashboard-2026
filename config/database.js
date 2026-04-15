import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Initialize dotenv at the start of the file
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  String(process.env.DB_PASSWORD || ""), // Forces the value to be a string
  {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    // Helpful for debugging in development
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    dialectOptions: {
      // Enable SSL for production (required by Render PostgreSQL)
      ...(process.env.NODE_ENV === "production" && {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Render uses self-signed certs
        },
      }),
    },
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  },
);

export default sequelize;
