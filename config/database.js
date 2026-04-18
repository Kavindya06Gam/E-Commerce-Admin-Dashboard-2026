import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Initialize dotenv at the start of the file
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

let sequelize;

// If GCP Unix Socket is provided
if (process.env.INSTANCE_UNIX_SOCKET) {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      dialect: "postgres",
      host: process.env.INSTANCE_UNIX_SOCKET, // Point to the socket path
      logging: isProduction ? false : console.log,
      dialectOptions: {
        // No SSL required for Unix sockets as they are internal and encrypted by GCP
      },
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    }
  );
} else if (process.env.DATABASE_URL) {
  // If a direct DATABASE_URL is provided (which Neon/Back4app uses)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: isProduction ? false : console.log,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
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
