const fs = require('fs');
const path = require('path');

const pkgPath = path.join(process.env.INIT_CWD || process.cwd(), 'package.json');

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

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Проверяем зависимости
const deps = ['css-loader', 'sass-loader', 'webpack', 'webpack-cli'];
const missing = [];

deps.forEach(dep => {
    const depPath = path.join(process.cwd(), 'node_modules', dep);
    if (!fs.existsSync(depPath)) {
        missing.push(dep);
    }
});

// Если чего-то нет - устанавливаем
if (missing.length > 0) {
    console.log(`📦 Устанавливаю: ${missing.join(' ')}`);
    try {
        execSync(`npm install --save-dev ${missing.join(' ')}`, {
            stdio: 'inherit', // Показываем процесс установки
            cwd: process.cwd()
        });
    } catch (error) {
        // Игнорируем ошибки, npm сам разберется
    }
}

if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    if (!pkg.scripts?.build) {
        pkg.scripts = {
            ...pkg.scripts,
            "build": "webpack --env production",
            "start": "webpack --watch"
        };
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

        // checkProjectDeps(['css-loader', 'sass-loader', 'webpack', 'webpack-cli']);
    }
}