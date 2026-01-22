module.exports = {
    getWebpackConfig: (options = {}) => {
      const baseConfig = require('./webpack.config.js');
      return baseConfig(options);
    }
  };