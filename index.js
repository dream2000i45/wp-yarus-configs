// ~/wp-common-configs/index.js

const path = require('path');
const fs = require('fs');




module.exports = {
    getWebpackConfig: (options = {}) => {
      const baseConfig = require('./webpack.config.js');
      return baseConfig(options);
    }
  };