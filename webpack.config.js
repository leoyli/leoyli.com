const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const browserConfig = {
  entry: path.resolve(__dirname, 'src/client/client.jsx'),
  output: { path: path.join(__dirname, 'static/public/scripts'), filename: 'bundle.js' },
  module: { rules: [{
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
    use: [
      MiniCssExtractPlugin.loader,
      { loader: 'css-loader', options: { sourceMap: true } },
      { loader: 'sass-loader', options: { sourceMap: true } },
    ],
  }],
  },
  plugins: [
    new webpack.DefinePlugin({ __isBrowser__: 'true' }),
    new MiniCssExtractPlugin({ filename: '../stylesheets/style.css' }),
  ],
  resolve: { extensions: ['.js', '.jsx'] },
  devtool: 'source-map',
};

const serverConfig = {
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
  devtool: 'sourcemap',
};


module.exports = [browserConfig, serverConfig];
