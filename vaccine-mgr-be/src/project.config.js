const Crypt = require('../src/helpers/crypt');
const path = require('path');

module.exports = {
  DEFAULT_PASSWORD: Crypt.encrypt('123123'),
  JWT_SECRET: 'vaccine-mgr',
  UPLOAD_DIR: path.resolve(__dirname, '../upload'),

  SERVER_PORT: 3000,
};
