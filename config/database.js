import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Initialize dotenv at the start of the file
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

let sequelize;

// If a direct DATABASE_URL is provided (which Neon/Back4app uses)
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: isProduction ? false : console.log,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required by Neon and many cloud databases
      },
    },
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  });
} else {
  // Fallback for local development using individual variables
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    String(process.env.DB_PASSWORD || ""),
    {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 5432,
      dialect: "postgres",
      logging: isProduction ? false : console.log,
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    }
  );
}

export default sequelize;
