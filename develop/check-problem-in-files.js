const fs = require('fs');
const path = require('path');

check_problem_in_php_files();

function check_problem_in_php_files() {
    const exclude_paths = [
        'node_modules',
        'inc\\seo.php',
        'vendor',
        'inc\\recaptcha',
        'inc\\class.phpmailer.php',
        'woocommerce'
    ];
    const directoryPath = '.';
    const ext = '.php';

    const filtersFns = [
        (string) => {
            const allowed_comments = [
                '/** !',
                '//!',
                '//VD',
                '//COMMENT',
                '//DESC',
                '//TODO',
                'https://',
                'http://',
                '"//',
                "'//",
                'php://',
                "'://",
                '*/*/',
                'eslint-disable-next-line'
            ];
            let count = 0;
            let allowed = false;
            allowed_comments.forEach((comment) => {
                if (string.includes(comment)) allowed = true;
            });

            if (!allowed && (/\/\//.test(string) || string.includes('/*'))) {
                count = 1;
            }

            return { name: 'has_comments', count };
        },

        (string) => {
            let count = 0;

            if (string.includes('var_dump') && !string.includes('//VD')) {
                count = 1;
            }

            return { name: 'has_var_dump', count };
        }
    ];

    check_problem_in_files(directoryPath, filtersFns, ext, exclude_paths);
}

function check_problem_in_files(root_dir, filtersFns = [], ext = '', exclude_paths = []) {
    const files = get_files_in_dir_recursive(root_dir, ext, exclude_paths);
    const errors = check_files_for_filters(files, filtersFns);
    print_result(files.length, errors);
    if (errors.length) {
        throw new Error();
    }
}

function print_result(count, errors) {
    let message = `${count} files have been checked\n\n`;
    if (!errors.length) {
        message += 'Result Success';
    } else {
        message += errors_to_sring(errors);
    }
    console.warn(message);
}

function errors_to_sring(all_errors) {
    let message = '';
    const counts = {};

    all_errors.forEach(({ filePath, errors }) => {
        let current_file_error = '';
        errors.forEach(({ line, name, count }) => {
            if (!current_file_error) current_file_error += `Warning file ${filePath}\n`;
            current_file_error += `   Error "${name}" found ${filePath}:${line + 1}\n`;
            if (!counts[name]) counts[name] = 0;
            counts[name] += count;
        });
        message += current_file_error;
    });

    message += `\n\n Result Errors:`;
    Object.keys(counts).forEach((key) => {
        message += ` "${key}" - ${counts[key]},`;
    });
    return message;
}

function get_files_in_dir_recursive(dir, ext = '', exclude_paths = [], scan_list = []) {
    try {
        fs.readdirSync(dir)?.forEach((file) => {
            const filePath = path.join(dir, file);
            if (exclude_paths.includes(filePath)) return;
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                get_files_in_dir_recursive(filePath, ext, exclude_paths, scan_list);
            } else if (!ext || filePath.endsWith(ext)) {
                scan_list.push(filePath);
            }
        });
    } catch (error) {}

    return scan_list;
}

function check_files_for_filters(files, filters) {
    const errors = [];

    files.forEach((filePath) => {
        const file_errors = {
            filePath,
            errors: []
        };

        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        lines.forEach((line, index) => {
            filters.forEach((filter) => {
                const result = filter(line);
                if (result.count) file_errors.errors.push({ ...result, line: index });
            });
        });

        if (file_errors.errors.length) errors.push(file_errors);
    });
    return errors;
}

function check_var_dump_in_string(string, filePath, index, allowed_comments = ['//VD']) {
    let count = 0;

    if (string.includes('var_dump') && !string.includes('//VD')) {
        count += 1;
    }

    return { name: 'has_var_dump', count };
}
