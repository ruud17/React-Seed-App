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
      // {
      //     test: [
      //         /\.png$/,
      //         /\.jpg$/
      //     ],
      //     loader: "url-loader"
      // },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: "css-loader"
        })
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
