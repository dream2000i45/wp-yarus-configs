// ~/wp-common-configs/index.js
module.exports = {
    webpack: require('./webpack.config.js'),
    // Можно добавить другие конфиги позже
    getWebpackConfig: (options = {}) => {
      const baseConfig = require('./webpack.config.js');
      return baseConfig(options.projectName || 'default-theme');
    }
  };