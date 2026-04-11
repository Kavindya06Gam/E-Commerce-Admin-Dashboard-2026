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
  resources: [...],
});