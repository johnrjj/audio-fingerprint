
var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: [
      //     'babel-polyfill',
      'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
      'webpack/hot/only-dev-server', // only hot modules...
      // 'webpack/hot/dev-server', // here will reload everything
      './src/main.jsx' // Your appʼs entry point
    ],
    devtool: process.env.WEBPACK_DEVTOOL || 'source-map',
    output: {
        path: path.join(__dirname, 'public'),
        publicPath: '/public/',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    worker: {
      output: {
        filename: "hash.worker.js",
        chunkFilename: "[id].hash.worker.js"
      }
    },
    module: {
        // preLoaders: [
        //   {
        //       test: /\.jsx?$/,
        //       exclude: /(node_modules|bower_components)/, 
        //       // loader: 'jshint-loader!eslint-loader',
        //       loader: 'eslint-loader',
        //   }
        // ],
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loaders: ['react-hot', 'babel'],
            },
            {
              test: /\.scss$/,
              loader: "style!css!autoprefixer!sass"
            }
         ]
    },
    devServer: {
        contentBase: "./",
        // noInfo: true, //  --no-info option
        hot: true,
        inline: true
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      // new webpack.NoErrorsPlugin()
    ],
    node: {
      fs: "empty"
    }
};

// var path = require('path');
// var webpack = require('webpack');

// module.exports = {
//   entry: [
//     'babel-polyfill',
//     './src/theme/main.less',
//     './src/main.jsx',
//     './local/start',
//     'webpack-dev-server/client?http://localhost:8080'
//   ],
//   output: { 
//     path: __dirname + '/dist', 
//     filename: 'bundle.js' 
//   },
//   debug: true,
//   devtool: 'source-map',
//   module: {
//     preLoaders: [
//       {
//           test: /\.jsx?$/,
//           exclude: /node_modules/, 
//           loader: "jshint-loader"
//       }
//     ],
//     loaders: [
//       { 
//         test: /\.jsx?$/,
//         include: path.join(__dirname, 'src'),
//         loader: 'babel-loader',
//         query: {
//           presets: ['es2015', 'react',  'stage-0']
//         }
//       },
//       { 
//         test: /\.less$/,
//         loader: "style!css!autoprefixer!less"
//       },
//     ]
//   },
//   devServer: {
//     contentBase: "./"
//   }
// };
