const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const EslintWebpackPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const extensions = ['.js', '.jsx'];

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  resolve: {
    extensions,
    alias: {
      app: path.resolve(__dirname, 'src/app/'),
      contracts: path.resolve(__dirname, 'src/contracts/'),
      utils: path.resolve(__dirname, 'src/utils/'),
      'config.js': path.resolve(__dirname, 'src/config.js'),
    },
  },
  devServer: {
    client: {
      overlay: false,
    },
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-react', { runtime: 'automatic' }]],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    // new EslintWebpackPlugin({ extensions }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new Dotenv({ path: path.resolve(__dirname, '../.env') }),
  ],
  stats: 'minimal',
};
