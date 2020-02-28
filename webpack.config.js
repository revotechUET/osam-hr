const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const webpackConfigure = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "app.bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader',
          options: { injectType: 'singletonStyleTag' }
        }, 'css-loader', 'less-loader']
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader?classPrefix'
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inlineSource: '.(js|css)$'
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new RemovePlugin({
      after: {
        include: ['./dist/app.bundle.js'],
        log: false,
        trash: false,
      }
    })
  ],
  mode: isProduction ? 'production' : 'development',
};

module.exports = webpackConfigure;
