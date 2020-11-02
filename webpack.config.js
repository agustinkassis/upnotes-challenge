const HtmlWebPackPlugin = require('html-webpack-plugin'),
      path = require( 'path' ),
      webpack = require("webpack");

module.exports = {
   context: __dirname,
   entry: ['@babel/polyfill', './src/index.js'],

   output: {
      path: path.resolve( __dirname, 'dist' ),
      filename: 'main.js',
   },
   devtool: 'eval-source-map',
   plugins: [
      new HtmlWebPackPlugin(),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
      }),
      new webpack.ProvidePlugin({
        L: 'leaflet',
        'window.L': 'leaflet',
      })
   ],
   module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.png$/,
        use: ['file-loader']
      },
    ],

  }
};
