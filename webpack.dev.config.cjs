/* eslint-env node */

// Configuração do Webpack para desenvolvimento com Hot Module Replacement

const path = require("path");

const config = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/",
    filename: "main.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
    ],
  },
  resolve: {
    extensions: ['.js']
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "./"),
    },
    compress: true,
    port: 3000,
    hot: true,
    liveReload: true,
    open: false,
    devMiddleware: {
      writeToDisk: false,
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  devtool: "eval-source-map",
  plugins: [],
};

module.exports = config;
