const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const chalk = require('chalk');

module.exports = function (_env, argv) {
  const environment =
    argv && argv.mode === 'production' ? 'production' : 'development';
  console.log(
    chalk.cyanBright.bold(`Building [${environment.toUpperCase()}]...`),
  );
  return {
    mode: environment,
    entry: './src/lib/index.ts',
    devtool: 'eval-source-map',
    devServer: {
      host: 'localhost',
      compress: true,
      port: 80,
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'gui-lib.js',
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        { test: /\.ts$/, loader: 'ts-loader' },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        favicon: './src/favicon.ico',
      }),
    ],
  };
};
