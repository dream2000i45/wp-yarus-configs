const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const { BUILD_DIR, JS_SRC, JS_SRC_ROOT, SCSS_SRC_ROOT, SCSS_SRC } = require('./develop/constants');
const {
    addBlockVariables,
    blockApperancesReplacePluginArgs,
    modalApperancesReplacePluginArgs
} = require('./develop/webpack-functions');

module.exports = (env) => {
    const mode = env.production ? 'production' : 'development';
    return {
        devtool: 'source-map',
        mode,
        resolve: {
            preferRelative: true
        },
        stats: { errorDetails: true },
        entry: path.join(JS_SRC, JS_SRC_ROOT),
        entry: () => {
            let entries = {
                ...glob.sync('./js/{blocks,modals,pages,themes}/*.js').reduce((entries, entry) => {
                    const name = entry.replaceAll('\\', '/').replace('js/', '').replace('.js', '');
                    entries['js/' + name] = entry.replaceAll('\\', '/');
                    if (entry.includes('blocks') || entry.includes('modals')) {
                        addBlockVariables(entries, entry, name, 'js');
                    }
                    return entries;
                }, {}),

                ...glob.sync('./scss/**/[^_]*.scss').reduce((entries, entry) => {
                    const name = entry.replaceAll('\\', '/').replace('scss/', '').replace('.scss', '');

                    entries['css/' + name] = entry.replaceAll('\\', '/');
                    if (entry.includes('blocks') || entry.includes('modals')) {
                        addBlockVariables(entries, entry, name, 'css');
                    }
                    return entries;
                }, {})
            };

            entries['js/scripts'] = path.join(JS_SRC, JS_SRC_ROOT);
            entries['css/style'] = path.join(SCSS_SRC, SCSS_SRC_ROOT);

            entries['admin/scripts'] = path.join('admin', 'scripts.js');
            entries['admin/style'] = path.join('admin', 'style.scss');

            return entries;
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, BUILD_DIR)
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: []
                },
                {
                    test: /\.scss$/,
                    exclude: /node_modules/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                }
            ]
        },

        plugins: [
            new WebpackNotifierPlugin(),
            new webpack.DefinePlugin({
                $: 'jQuery'
            }),
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ['**/*', '!reactjs/**']
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css'
            }),
            new ReplaceInFileWebpackPlugin(blockApperancesReplacePluginArgs),
            new ReplaceInFileWebpackPlugin(modalApperancesReplacePluginArgs)
        ]
    };
};
