import AdminJS from 'adminjs';

import {
  userResource,
  productResource,
  categoryResource,
  orderResource,
  orderItemResource,
  settingResource
} from './resources.js';

const adminJs = new AdminJS({
  rootPath: '/admin',

  resources: [
    userResource,
    productResource,
    categoryResource,
    orderResource,
    orderItemResource,
    settingResource
  ],
  // This is required for RBAC
  currentAdmin: async (request) => {
    return request.session?.adminUser || null;
  }
});

export default adminJs;