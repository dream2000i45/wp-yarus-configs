const path = require('path');
const {
    BUILD_DIR,
    SCSS_OUT,
    SCSS_SRC_BLOCKS,
    SCSS_SRC_MODALS,
    JS_SRC_MODALS,
    JS_OUT,
    JS_SRC_BLOCKS
} = require('./constants');

module.exports = {
    addBlockVariables: function (entries, entry, name, dir) {
        let new_name = name;
        const file_name = name.split('\\').pop();
        if (!/^.+_\d+$/.test(file_name)) new_name += '_1';
        entries[dir + '/' + new_name + '_v'] = entry;
    },
    blockApperancesReplacePluginArgs: [
        ...[...new Array(30)].map((_, key) => {
            const apperance = key + 1;
            return {
                dir: path.join(BUILD_DIR, SCSS_OUT, SCSS_SRC_BLOCKS),
                test: new RegExp(`_${apperance}_v.css`, 'g'),
                rules: [
                    {
                        search: /-block(?!\/)(?!\\)(?!;)(?!-)/g,
                        replace: `-block-${apperance}`
                    }
                ]
            };
        }),
        ...[...new Array(30)].map((_, key) => {
            const apperance = key + 1;
            return {
                dir: path.join(BUILD_DIR, JS_OUT, JS_SRC_BLOCKS),
                test: new RegExp(`_${apperance}_v.js`, 'g'),
                rules: [
                    {
                        search: /-block(?!\/)(?!\\)(?!;)(?!-)/g,
                        replace: `-block-${apperance}`
                    }
                ]
            };
        })
    ],
    modalApperancesReplacePluginArgs: [
        ...[...new Array(30)].map((_, key) => {
            const apperance = key + 1;
            return {
                dir: path.join(BUILD_DIR, SCSS_OUT, SCSS_SRC_MODALS),
                test: new RegExp(`_${apperance}_v.css`, 'g'),
                rules: [
                    {
                        search: /-modal(?!\/)(?!\\)(?!;)(?!-)/g,
                        replace: `-modal-${apperance}`
                    }
                ]
            };
        }),
        ...[...new Array(30)].map((_, key) => {
            const apperance = key + 1;
            return {
                dir: path.join(BUILD_DIR, JS_OUT, JS_SRC_MODALS),
                test: new RegExp(`_${apperance}_v.js`, 'g'),
                rules: [
                    {
                        search: /-modal(?!\/)(?!\\)(?!;)(?!-)/g,
                        replace: `-modal-${apperance}`
                    }
                ]
            };
        })
    ]
};
