const path = require('path');
const devMode = process.env.NODE_ENV !== 'production';
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: './src/js/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
  	filename: 'build.js',
    publicPath: devMode ? '/dist' : path.join(__dirname, 'dist/')
  },
  mode: devMode ? "development" : "production",
  module: {
    rules: [
      {
         test: /\.js$/,
         exclude: /node_modules/,
         use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        use: [
          devMode ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../dist/'
            }
          },
          "css-loader", "sass-loader"
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      chunkFilename: "main.css"
    })
  ],
  devServer: {
    static: './',
  },
};
