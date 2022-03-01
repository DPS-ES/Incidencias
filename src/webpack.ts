// tslint:disable: object-literal-sort-keys
import * as path from 'path';

const entry: { [key: string]: string[] } = {};
let plugins: any[];
let HtmlWebpackPlugin: any;

export function init(
  webpack: any,
  HardSourceWebpackPlugin: any,
  ScriptExtHtmlWebpackPlugin: any,
  MiniCssExtractPlugin: any,
  workboxPlugin: any,
  HtmlWebpackPlugin2: any
): void {
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

export function addPage(
  source: string,
  route?: string,
  publicName?: string
): void {
  const basename = source.split('/').slice(-1)[0];
  if (!publicName) {
    publicName = basename;
  }
  let newName = basename;
  let i = 2;
  while (newName in entry) {
    newName = `${basename}${i++}`;
  }
  plugins.unshift(
    new HtmlWebpackPlugin({
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
    })
  );
  entry[newName] = ['babel-polyfill', `./src/js/${source}.js`];
}

export function commonConfig(): { [key: string]: any } {
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

export const devConfig = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
};

export function prepareProd(common: any, MiniCssExtractPlugin: any) {
  common.module.rules[5].use[1].options = {
    configFile: 'prod.eslintrc.js',
  };

  common.module.rules[4].use[0] = MiniCssExtractPlugin.loader;
  common.module.rules[4].use[3] = common.module.rules[4].use[2];
  common.module.rules[4].use[2] = 'postcss-loader';
}

export function prodConfig(
  TerserPlugin: any,
  CleanWebpackPlugin: any,
  CompressionPlugin: any,
  ImageminPlugin: any,
  imageminMozjpeg: any,
  WebappWebpackPlugin: any,
  config: any,
  BundleAnalyzerPlugin: any
) {
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
