#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Инициализация проекта...');

// 1. Проверка зависимостей
const deps = ['css-loader', 'sass-loader', 'webpack', 'webpack-cli'];
const missing = deps.filter(dep => 
  !fs.existsSync(path.join(process.cwd(), 'node_modules', dep))
);

if (missing.length) {
  console.log(`📦 Устанавливаю: ${missing.join(' ')}`);
  execSync(`npm install --save-dev ${missing.join(' ')}`, { stdio: 'inherit' });
}

// 2. Добавляем скрипты
const pkgPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.scripts = {
    ...pkg.scripts,
    "build": "webpack --env production",
    "start": "webpack --watch"
  };
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log('✅ Скрипты добавлены');
}

// 3. Обновляем общий пакет
console.log('🔄 Обновляю wp-yarus-configs...');
try {
  execSync('npm update wp-yarus-configs', { stdio: 'pipe' });
} catch {
  // Если не получилось - не страшно
}

console.log('🎉 Готово!');