"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prodConfig = exports.prepareProd = exports.devConfig = exports.commonConfig = exports.addPage = exports.init = void 0;
// tslint:disable: object-literal-sort-keys
const path = __importStar(require("path"));
const entry = {};
let plugins;
let HtmlWebpackPlugin;
function init(webpack, HardSourceWebpackPlugin, ScriptExtHtmlWebpackPlugin, MiniCssExtractPlugin, workboxPlugin, HtmlWebpackPlugin2) {
    HtmlWebpackPlugin = HtmlWebpackPlugin2;
    plugins = [
        new webpack.ProgressPlugin(),
        new HardSourceWebpackPlugin(),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer',
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name]-[contenthash:4].css',
        }),
        new workboxPlugin.InjectManifest({
            swSrc: './src/sw/sw.js',
            swDest: 'sw.js',
            exclude: [/.*\/icons\/(?!favicon).*/, /^manifest\..*\.json$/],
            precacheManifestFilename: 'precache-[manifestHash].js',
        }),
    ];
}
exports.init = init;
function addPage(source, route, publicName) {
    const basename = source.split('/').slice(-1)[0];
    if (!publicName) {
        publicName = basename;
    }
    let newName = basename;
    let i = 2;
    while (newName in entry) {
        newName = `${basename}${i++}`;
    }
    plugins.unshift(new HtmlWebpackPlugin({
        inject: true,
        minify: {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: false,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
        },
        template: `./src/html/${source}.html`,
        filename: `${route ? route + '/' : ''}${publicName}.html`,
        chunks: [newName],
    }));
    entry[newName] = ['babel-polyfill', `./src/js/${source}.js`];
}
exports.addPage = addPage;
function commonConfig() {
    return {
        mode: 'development',
        entry,
        output: {
            path: path.resolve(process.cwd(), 'public'),
            filename: 'js/[name].js',
        },
        module: {
            rules: [
                {
                    test: /\.txt$/,
                    use: 'raw-loader',
                },
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'htmllint-loader',
                            options: {
                                config: '.htmllintrc',
                            },
                        },
                        'underscore-template-loader',
                    ],
                },
                {
                    test: /\.(jpe?g|png|gif|svg|webp)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name]-[hash:4].[ext]',
                                outputPath: 'img/',
                                publicPath: '/img/',
                                esModule: false,
                            },
                        },
                    ],
                },
                {
                    test: /\.(woff|woff2|ttf|otf)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'fonts/',
                                publicPath: 'fonts/',
                            },
                        },
                    ],
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                                sassOptions: {
                                    includePaths: ['./node_modules'],
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: [
                        'babel-loader',
                        {
                            loader: 'eslint-loader',
                        },
                    ],
                },
            ],
        },
        plugins,
        // externals: {
        //   $: 'jquery',
        //   jquery: 'jQuery',
        //   'window.$': 'jquery',
        // },
    };
}
exports.commonConfig = commonConfig;
exports.devConfig = {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
};
function prepareProd(common, MiniCssExtractPlugin) {
    common.module.rules[5].use[1].options = {
        configFile: 'prod.eslintrc.js',
    };
    common.module.rules[4].use[0] = MiniCssExtractPlugin.loader;
    common.module.rules[4].use[3] = common.module.rules[4].use[2];
    common.module.rules[4].use[2] = 'postcss-loader';
}
exports.prepareProd = prepareProd;
function prodConfig(TerserPlugin, CleanWebpackPlugin, CompressionPlugin, ImageminPlugin, imageminMozjpeg, WebappWebpackPlugin, config, BundleAnalyzerPlugin) {
    return {
        mode: 'production',
        output: {
            filename: 'js/[name]-[contenthash:4].js',
        },
        optimization: {
            minimizer: [
                new TerserPlugin({
                    test: /\.js(\?.*)?$/i,
                    parallel: true,
                }),
            ],
            splitChunks: {
                cacheGroups: {
                    lib: {
                        test: /[\\/]node_modules[\\/]((?!materialize)(?!dps-common).*)[\\/]/,
                        name: 'lib',
                        chunks: 'all',
                    },
                    components: {
                        test: /[\\/]node_modules[\\/]components[\\/]/,
                        name: 'components',
                        chunks: 'all',
                        enforce: true,
                    },
                },
            },
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CompressionPlugin({
                test: /\.(html|css|js)(\?.*)?$/i, // only compressed html/css/js, skips compressing sourcemaps etc
            }),
            new ImageminPlugin({
                test: /\.(jpe?g|png|gif|svg)$/i,
                gifsicle: {
                    // lossless gif compressor
                    optimizationLevel: 9,
                },
                pngquant: {
                    // lossy png compressor, remove for default lossless
                    quality: '75',
                },
                plugins: [
                    imageminMozjpeg({
                        // lossy jpg compressor, remove for default lossless
                        quality: '75',
                    }),
                ],
            }),
            new WebappWebpackPlugin({
                logo: config.logo,
                cache: true,
                prefix: '/img/icons/',
                inject: true,
                favicons: {
                    ...config.pwaManifest,
                    icons: {
                        android: true,
                        appleIcon: true,
                        appleStartup: true,
                        coast: false,
                        favicons: true,
                        firefox: false,
                        windows: false,
                        yandex: false,
                    },
                },
            }),
            ...(process.env.ANALYZE ? [new BundleAnalyzerPlugin()] : []),
        ],
    };
}
exports.prodConfig = prodConfig;
