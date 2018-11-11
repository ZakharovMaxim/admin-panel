const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const prod = process.argv.indexOf('-p') !== -1;
const config = {
  entry: path.resolve(__dirname,'src', 'index.js'),
  output: {
    path: path.resolve(__dirname,'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
        presets: ['es2015', 'stage-2']
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader', {
            loader: 'image-webpack-loader',
            options: {
              name: 'img/[name].[ext]',
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              mozjpeg: {
                progressive: true,
                quality: 65
              }
            }
          }
        ]
      },
      {
      test: /\.(ttf|eot|woff|woff2|otf)$/,
      loader: 'file-loader',
      options: {
         name: 'font/[name].[ext]',
      }
      }
    ]
  },
  plugins: [
    new UglifyJsPlugin()
  ]
}

if(!prod) {
  config.module.rules.push({
    test: /\.scss$/,
    use: [{
      loader: "style-loader" // creates style nodes from JS strings
    }, {
      loader: "css-loader" // translates CSS into CommonJS
    }, {
      loader: "sass-loader" // compiles Sass to CSS
    }]
  });
} else {
  config.module.rules.push({
    test: /\.scss$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader', 'sass-loader']
    })
  });
  config.plugins.push(new ExtractTextPlugin('style2.css'));
}


module.exports = config;
