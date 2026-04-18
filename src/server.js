// 1. MUST BE FIRST: Load environment variables before any other imports
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import express from "express";
import session from "express-session";
import AdminJSExpress from "@adminjs/express";
import ConnectSessionSequelize from "connect-session-sequelize";
import bcrypt from "bcryptjs";
import adminJs from "./admin/adminConfig.js";
import { sequelize, User } from "./models/index.js";
import authRouter from "./routes/auth.js";
import apiRouter from "./routes/api.js";

const app = express();

const ensureDefaultAdminUser = async () => {
  const defaultAdminEmail = (process.env.DEFAULT_ADMIN_EMAIL || "admin@example.com")
    .toLowerCase()
    .trim();
  const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "Admin@1234";
  const defaultAdminName = process.env.DEFAULT_ADMIN_NAME || "Super Admin";
  const shouldResetDefaultAdminPassword =
    String(process.env.RESET_DEFAULT_ADMIN_PASSWORD || "false").toLowerCase() === "true";

  if (!defaultAdminPassword) {
    console.warn("Skipping default admin bootstrap: password is empty");
    return;
  }

  const existingAdmin = await User.findOne({ where: { email: defaultAdminEmail } });

  if (existingAdmin) {
    const updates = {};
    if (!existingAdmin.isActive) updates.isActive = true;
    if (existingAdmin.role !== "admin") updates.role = "admin";
    if (shouldResetDefaultAdminPassword) updates.password = defaultAdminPassword;

    if (Object.keys(updates).length > 0) {
      await existingAdmin.update(updates);
      console.log(`Updated default admin account: ${defaultAdminEmail}`);
    }

    return;
  }

  await User.create({
    name: defaultAdminName,
    email: defaultAdminEmail,
    password: defaultAdminPassword,
    role: "admin",
    isActive: true,
  });

  console.log(`Created default admin account: ${defaultAdminEmail}`);
};

// Setup Session Store
const SequelizeStore = ConnectSessionSequelize(session.Store);
const sessionStore = new SequelizeStore({ 
  db: sequelize,
  tableName: 'Sessions' // Explicit table name
});

// Build Authenticated Router
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      console.log("Auth Attempt:", email);
      try {
        const user = await User.findOne({
          where: { email: email.toLowerCase().trim() },
        });

        if (!user || !user.isActive) {
          console.log("User not found or inactive");
          return null;
        }

        const valid = await bcrypt.compare(password, user.password);
        console.log("Password check:", valid ? "VALID" : "INVALID");

        // Allow any active user with a valid password to log in
        if (!valid) {
          console.log("Access Denied: Incorrect credentials");
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      } catch (err) {
        console.error("Auth Error:", err.message);
        return null;
      }
    },
    cookieName: "adminjs_session",
    cookiePassword: process.env.COOKIE_PASSWORD || "a_very_long_32_character_password_minimum",
  },
  null,
  {
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || "another_very_long_32_char_secret_for_session",
    cookie: {
      secure: process.env.NODE_ENV === "production", // Must be true for GCP HTTPS
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }
);

// Mount AdminJS FIRST
app.use(adminJs.options.rootPath, adminRouter);

// Body parsers (must be after AdminJS so express-formidable isn't blocked)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
app.use('/api', authRouter);
app.use('/api', apiRouter);

// Root Redirect
app.get("/", (req, res) => res.redirect("/admin"));

const start = async () => {
  try {
    // 1. Connect to DB
    await sequelize.authenticate();
    console.log("PostgreSQL connected");

    // 2. Sync Models & Session Store
    await sequelize.sync();
    await sessionStore.sync(); 
    await ensureDefaultAdminUser();
    console.log("Database & Sessions Synced");

    // 3. Start Listening
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Admin Panel running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Critical Startup Error:", error);
  }
};

start();