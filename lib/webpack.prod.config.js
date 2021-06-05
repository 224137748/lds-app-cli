
const { VueLoaderPlugin } = require('vue-loader');
const WebpackProgressBar = require('simple-progress-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {},
  output: {},
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue']
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.(htm|html)$/i,
        loader: 'html-withimg-loader'
      },
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ['@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: 2
              }],
              '@babel/preset-react'
            ]
          }
        }
      },
    ]
  },
  plugins: [
    new WebpackProgressBar(),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
  ]

};