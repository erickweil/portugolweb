/* eslint-env node */

// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const WebPackBundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const TerserPlugin = require("terser-webpack-plugin");
//const isProduction = process.env.NODE_ENV == "production";
const isProduction = true;

const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : "style-loader";

const config = {
  entry: 
  //"./src/index.js"
  "./src/ace_editor/ace_webpack.js" // para juntar os arquivos
  ,
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: '/dist/',
    filename: "ace.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      /*{
        test: /\.css$/i,
        use: [stylesHandler, "css-loader"],
      },*/
      /*{
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },*/

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  
  optimization: {

    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        compress: {
          ecma: 2015,
          inline: 2,
          module: true,
          passes: 3
        },

        mangle: {
          module: true,
          toplevel: true
        },
        format: {
          
          comments: false,
          ecma: 2015
        }
      }
    })],
  },

  resolve: {
      extensions: ['.js']
  },

  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    //new WebPackBundleAnalyzer()
  ],
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";

    config.plugins.push(new MiniCssExtractPlugin());
  } else {
    config.mode = "development";
  }
  return config;
};
