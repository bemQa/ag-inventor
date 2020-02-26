const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

function _path(p) {
  return path.join(__dirname, p);
}

module.exports = {
  mode: "development",
  entry: [
    './src/js/app.js',
    './src/css/entry.scss',
    './src/css/build.scss',
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './public',
    hot: true
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {
          loader: 'html-loader'
        }
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'css/[name].css',
            }
          },
          {
            loader: 'extract-loader'
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]'
          }
        }]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'img/[folder]/[name].[ext]'
          }
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/html/index.html',
      filename: './index.html',
      favicon: './src/img/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      template: './src/html/lk.html',
      filename: './lk/index.html',
      favicon: './src/img/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      template: './src/html/faq.html',
      filename: './faq/index.html',
      favicon: './src/img/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      template: './src/html/404.html',
      filename: './404/index.html',
      favicon: './src/img/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      template: './src/html/500.html',
      filename: './500/index.html',
      favicon: './src/img/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      template: './src/html/build.html',
      filename: './build/index.html',
      favicon: './src/img/favicon.ico'
    }),
  ]
};
