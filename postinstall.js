const fs = require('fs');
const path = require('path');

// Авто-добавление скриптов
const pkgPath = path.join(process.env.INIT_CWD || process.cwd(), 'package.json');

if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  
  if (!pkg.scripts?.build) {
    pkg.scripts = {
      ...pkg.scripts,
      "build": "webpack --env production",
      "start": "webpack --watch"
    };
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log('✅ Скрипты добавлены в package.json');
  }
}