import AdminJS from "adminjs";
import AdminJSSequelize from "@adminjs/sequelize"; // Import the adapter

import {
  userResource,
  productResource,
  categoryResource,
  orderResource,
  orderItemResource,
  settingResource,
} from "./resources.js";

// CRITICAL: You must register the adapter so AdminJS understands Sequelize models
AdminJS.registerAdapter(AdminJSSequelize);

const adminJs = new AdminJS({
  rootPath: "/admin",
  branding: {
    companyName: "Ecommerce Admin",
    withMadeWithLove: false,
  },
  resources: [
    userResource,
    productResource,
    categoryResource,
    orderResource,
    orderItemResource,
    settingResource,
  ],
  // This is required for RBAC logic
  currentAdmin: async (request) => {
    return request.session?.adminUser || null;
  },
});

export default adminJs;
