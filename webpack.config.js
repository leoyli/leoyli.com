const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');


// env
// const ENV_FILE = '.ebextensions/01_node-env.config.dev';
const ENV_FILE = '.ebextensions/01_node-env.config';
const ENV_PRODUCTION_YAML = fs.readFileSync(ENV_FILE).toString();
const ENV = yaml.safeLoad(ENV_PRODUCTION_YAML).option_settings['aws:elasticbeanstalk:application:environment'];
console.log('ENV LOADED UNDER .ebextensions:\n', ENV);


// webpack
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');


// build
const browserConfig = (env = {}) => ({
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
            'babel-plugin-transform-class-properties',
            'babel-plugin-transform-object-rest-spread',
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
  plugins: [
    new MiniCssExtractPlugin({ filename: '../stylesheets/style.css' }),
    new webpack.DefinePlugin({ __isBrowser__: 'true' }),
    new webpack.EnvironmentPlugin(ENV),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new BundleAnalyzerPlugin(),
  ],
  resolve: { extensions: ['.js', '.jsx'] },
  devtool: env.production ? 'nosources-source-map' : 'source-map',
});

const serverConfig = (env = {}) => ({
  entry: path.resolve(__dirname, 'src/server/server.js'),
  output: { path: path.join(__dirname, 'bin'), filename: 'www' },
  node: { __filename: false, __dirname: false },
  externals: [nodeExternals()],
  target: 'node',
  module: {
    rules: [{
      test: /\.s?css$/,
      loader: 'ignore-loader',
    }, {
      test: /\.(jsx)$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['react'],
          plugins: [
            'babel-plugin-transform-class-properties',
            'babel-plugin-transform-object-rest-spread',
            'babel-plugin-transform-es2015-modules-commonjs',
          ],
        },
      }],
    }],
  },
  plugins: [new webpack.DefinePlugin({ __isBrowser__: 'false' })],
  resolve: { extensions: ['.js', '.jsx'] },
  devtool: env.production ? 'nosources-source-map' : 'source-map',
});


module.exports = [browserConfig, serverConfig];
