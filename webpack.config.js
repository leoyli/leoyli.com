const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');


// webpack
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');


// constants
const ENV_FILE_DEV = '.ebextensions/01_node-env.config.dev';
const ENV_FILE_PRO = '.ebextensions/01_node-env.config';
const ENV_KEY = 'aws:elasticbeanstalk:application:environment';


// plugins
const loadWebpackPlugins = (platform, isProduction) => {
  const ENV_VAR = platform === 'browser' && yaml
    .safeLoad(fs.readFileSync(isProduction ? ENV_FILE_PRO : ENV_FILE_DEV).toString())
    .option_settings[ENV_KEY];
  if (platform === 'browser') console.log('ENV LOADED UNDER .ebextensions:\n', ENV_VAR || null);

  const plugins = [
    new webpack.DefinePlugin({ __isBrowser__: platform === 'browser' }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ];

  if (platform === 'browser') {
    if (isProduction) plugins.push(new BundleAnalyzerPlugin());
    plugins.push(new webpack.EnvironmentPlugin(ENV_VAR));
    plugins.push(new MiniCssExtractPlugin({ filename: '../stylesheets/style.css' }));
  }

  return plugins;
};

const loadBabelPlugins = (platform, isProduction) => {
  const plugins = [
    ['babel-plugin-styled-components', { ssr: true }],
    ['babel-plugin-transform-class-properties'],
    ['babel-plugin-transform-object-rest-spread'],
  ];

  if (platform === 'server') {
    plugins.push(['babel-plugin-transform-es2015-modules-commonjs']);
  }

  if (!isProduction) {
    plugins.push(['babel-plugin-transform-react-jsx-source']);
  }

  return plugins;
};


// build
const browserConfig = (env = {}) => ({
  entry: path.resolve(__dirname, 'src/client/client.jsx'),
  output: { path: path.join(__dirname, 'static/public/scripts'), filename: 'bundle.js' },
  module: {
    rules: [{
      test: /\.(jsx?)$/i,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react'],
          plugins: loadBabelPlugins('browser', env.production),
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
  plugins: loadWebpackPlugins('browser', env.production),
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
      test: /\.(jsx)$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['react'],
          plugins: loadBabelPlugins('server', env.production),
        },
      }],
    }, {
      test: /\.s?css$/,
      loader: 'ignore-loader',
    }],
  },
  plugins: loadWebpackPlugins('server', env.production),
  resolve: { extensions: ['.js', '.jsx'] },
  devtool: env.production ? 'nosources-source-map' : 'source-map',
});


// exports
module.exports = [browserConfig, serverConfig];
