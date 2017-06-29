const webpack = require('webpack'),
  path = require('path');

const APP = path.resolve(__dirname, "app"),
  NODE_MODULES = path.resolve(__dirname, "node_modules")

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './app/index.html',
  filename: '../index.html',
  inject: 'body'
})

const config = {
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client?reload=true', //note that it reloads the page if hot module reloading fails.
    './app/index.js'
  ],

  output: {
    path: path.resolve(__dirname, './app/build'),
    publicPath: '/build',
    filename: 'bundle.js'
  },

  resolve: {
    extensions: [
      '.js',
      '.jsx'
    ]
  },

  module: {
    loaders: [{
        test: /\.jsx?$/,
        include: APP,
        loader: "babel-loader",
        exclude: [NODE_MODULES]
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: "url-loader"
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: "css-loader"
        })
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'url?prefix=font/&limit=5000'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new ExtractTextPlugin({
      filename: 'style.css'
    }),
    HtmlWebpackPluginConfig
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true
      }
    })
  )

} else {
  config.devServer = {
    contentBase: './app',
    inline: true,
    port: 9000
  }
}

module.exports = config
