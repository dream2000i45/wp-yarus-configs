var gulp = require('gulp');
var watch = require('gulp-watch');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass')(require('sass'));
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
const replace = require('gulp-replace');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const scss_list = require('./gulp/scss_list');
const js_list = require('./gulp/js_list');
var fs = require('fs');

async function createBlock() {
    const args = process.argv.slice(3);

    let block_name = args[0].replace('--', '');
    let block_content = '';

    if (block_name.includes('group')) {
        const fields_group_path = `acf-json/${block_name}.json`;
        const { title, location, fields } = JSON.parse(fs.readFileSync(fields_group_path, 'utf8'));

        block_name = location[0][0]['value'].replace('acf/', '');

        block_content = '<?php ';

        fields.forEach(({ name, type }, key) => {
            if (!name) return;
            block_content += `
            $${name} = `;
            if (type === 'image') {
                block_content += `wp_get_attachment_image_url($block['${name}'],'large') ?? false;`;
            } else {
                block_content += `$block['${name}'] ?? false;`;
            }
        });
        block_content += `
        ?>
        `;

        fields.forEach(({ name, type }, key) => {
            if (!name) return;
            block_content += `
            <?php if ($${name}) { ?>
                <div class="${block_name}__${name}">
                ${type === 'image' ? `<img src="<?=$${name}?>" alt="${name}" class="${block_name}__${name}">` : `<?=$${name}?>`}
                </div>
            <?php } ?>
            `;
        });
    }

    if (!block_name) return;

    const php_path = 'parts/blocks/' + block_name;
    createFile(php_path, 'php', block_content);

    if (!args.includes('-css')) {
        const style_path = 'css/parts/blocks/' + block_name;
        const scss_content = `@import '../../../partials/variables';
        .${block_name} {
            @media (max-width: 1400px) {}
            @media (max-width: 1200px) {}
            @media (max-width: 1100px) {}
            @media (max-width: 992px) {}
            @media (max-width: 768px) {}
            @media (max-width: 576px) {}
            @media (max-width: 450px) {}
            @media (max-width: 375px) {}
        }`;
        fs.mkdir(style_path, (err) => {
            if (err) throw err; // не удалось создать папку
            createFile(style_path + '/style', 'scss', scss_content);
            createFile(style_path + '/style', 'css');
        });
    }

    if (!args.includes('-js')) {
        const js_path = 'js/blocks/' + block_name;
        createFile(js_path, 'js');
    }

    // Функция для создания файлов

    function createFile(fileName, fileExt, fileContent = '') {
        fs.writeFile(`${fileName}.${fileExt}`, fileContent, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(`${fileName}.${fileExt} файл создан успешно!`);
        });
    }
}

async function copyBlock() {
    const args = process.argv.slice(3);

    let block_old = args[0].replace('--', '').trim();
    let block_new = args[1].replace('--', '').trim();

    // return;
    if (!block_old || !block_new) return;

    const php_path_old = 'parts/blocks/' + block_old + '.php';
    const php_path_new = 'parts/blocks/' + block_new;

    fs.readFile(php_path_old, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const content = data.replaceAll(block_old, block_new);
        createFile(php_path_new, 'php', content);
    });

    if (!args.includes('-css')) {
        const style_path_old = 'css/parts/blocks/' + block_old + '/style.scss';
        const style_path_new = 'css/parts/blocks/' + block_new;

        fs.readFile(style_path_old, 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const content = data.replaceAll(block_old, block_new);
            // .split('\n').filter((item) => !item.includes(':') || !item.includes(';')).join('\n')

            fs.mkdir(style_path_new, (err) => {
                if (err) throw err; // не удалось создать папку
                createFile(style_path_new + '/style', 'scss', content);
            });
        });
    }

    if (!args.includes('-js')) {
        const php_path_old = 'js/blocks/' + block_old + '.js';
        const php_path_new = 'js/blocks/' + block_new;

        fs.readFile(php_path_old, 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const content = data.replaceAll(block_old, block_new);
            createFile(php_path_new, 'js', content);
        });
    }

    function createFile(fileName, fileExt, fileContent = '') {
        fs.writeFile(`${fileName}.${fileExt}`, fileContent, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(`${fileName}.${fileExt} файл создан успешно!`);
        });
    }
}

async function createApperance() {
    const args = process.argv.slice(3);

    let block_name = args[0].replace('--', '').trim();
    let style_new_prefix = args[1].replace('--', '').trim();

    if (!args.includes('-css')) {
        const style_path_old = 'css/parts/blocks/' + block_name + '/style.scss';
        const style_path_new = 'css/parts/blocks/' + block_name + '/style_' + style_new_prefix;

        fs.readFile(style_path_old, 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const content = data
                .split('\n')
                .filter((item) => !item.includes(':') || !item.includes(';'))
                .join('\n');

            createFile(style_path_new, 'scss', content);
        });
    }

    function createFile(fileName, fileExt, fileContent = '') {
        fs.writeFile(`${fileName}.${fileExt}`, fileContent, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(`${fileName}.${fileExt} файл создан успешно!`);
        });
    }
}
