const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');


// webpack
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');


// build
const browserConfig = (env = {}) => {
  // conditional environment variables
  const ENV_FILE_DEV = '.ebextensions/01_node-env.config.dev';
  const ENV_FILE_PRO = '.ebextensions/01_node-env.config';
  const ENV_PRODUCTION_YAML = fs.readFileSync(env.production ? ENV_FILE_PRO : ENV_FILE_DEV).toString();
  const ENV = yaml.safeLoad(ENV_PRODUCTION_YAML).option_settings['aws:elasticbeanstalk:application:environment'];
  console.log('ENV LOADED UNDER .ebextensions:\n', ENV);

  // conditional plugins
  const plugins = [
    new MiniCssExtractPlugin({ filename: '../stylesheets/style.css' }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin({ __isBrowser__: 'true' }),
    new webpack.EnvironmentPlugin(ENV),
  ];
  if (env.production) plugins.push(new BundleAnalyzerPlugin());

  return {
    entry: path.resolve(__dirname, 'src/client/client.jsx'),
    output: { path: path.join(__dirname, 'static/public/scripts'), filename: 'bundle.js' },
    module: {
      rules: [{
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'],
            plugins: [
              ['babel-plugin-styled-components', { ssr: true }],
              ['babel-plugin-transform-class-properties'],
              ['babel-plugin-transform-object-rest-spread'],
            ],
          },
        }],
      }, {
        test: /\.s?css$/,
        sideEffects: true,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      }],
    },
    plugins,
    resolve: { extensions: ['.js', '.jsx'] },
    devtool: env.production ? 'nosources-source-map' : 'source-map',
  };
};

const serverConfig = (env = {}) => ({
  entry: path.resolve(__dirname, 'src/server/server.js'),
  output: { path: path.join(__dirname, 'bin'), filename: 'www' },
  node: { __filename: false, __dirname: false },
  externals: [nodeExternals()],
  target: 'node',
  module: {
    rules: [{
      test: /\.(jsx)$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['react'],
          plugins: [
            ['babel-plugin-styled-components', { ssr: true }],
            ['babel-plugin-transform-class-properties'],
            ['babel-plugin-transform-object-rest-spread'],
            ['babel-plugin-transform-es2015-modules-commonjs'],
          ],
        },
      }],
    }, {
      test: /\.s?css$/,
      loader: 'ignore-loader',
    }],
  },
  plugins: [new webpack.DefinePlugin({ __isBrowser__: 'false' })],
  resolve: { extensions: ['.js', '.jsx'] },
  devtool: env.production ? 'nosources-source-map' : 'source-map',
});


module.exports = [browserConfig, serverConfig];
