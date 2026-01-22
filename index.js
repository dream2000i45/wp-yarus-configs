// ~/wp-common-configs/index.js

const path = require('path');
const fs = require('fs');

function checkProjectDeps(deps) {
  const projectRoot = process.cwd();
  const missing = [];

  deps.forEach(dep => {
    const depPath = path.join(projectRoot, 'node_modules', dep);
    if (!fs.existsSync(depPath)) {
      missing.push(dep);
    }
  });

  if (missing.length > 0) {
    console.error(`❌ Установите: npm install ${missing.join(' ')}`);
    process.exit(1);
  }
}


module.exports = {
    getWebpackConfig: (options = {}) => {
      checkProjectDeps(['css-loader', 'sass-loader', 'webpack', 'webpack-cli']);
      const baseConfig = require('./webpack.config.js');
      return baseConfig(options);
    }
  };