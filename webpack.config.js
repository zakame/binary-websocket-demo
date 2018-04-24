var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    contentBase: './dist'
  },
  entry: {
    index: './src/index.js',
    pricer: './src/pricer.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /templates\/.+\.html$/,
        use: [
          'html-loader'
        ]
      }
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ExtractTextPlugin('style.css'),
    new HtmlWebpackPlugin({
      chunks: ['index'],
      template: './src/index.html',
      title: 'Binary.com WebSocket API demo'
    }),
    new HtmlWebpackPlugin({
      chunks: ['pricer'],
      filename: 'pricer.html',
      template: './src/pricer.html',
      title: 'Binary.com WebSocket API Pricer demo'
    })
  ]
};
