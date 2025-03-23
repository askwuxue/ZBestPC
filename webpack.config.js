const path = require("path");

const webpack = require("webpack"); // 用于访问内置插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
    login: "./src/js/login.js",
  },
  output: {
    filename: "[name].[hash:8].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    open: true,
    hot: true,
    port: 8080,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
      }),
    ],
    splitChunks: {
      chunks: "all",
      minSize: 200 * 1024,
      cacheGroups: {
        vendors: {
          name: "jquery.chunk",
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "img/[name].[hash:8].[ext]",
        },
        // TODO,不知道怎么正确配置
        // parser: {
        //   dataUrlCondition: {
        //     maxSize: 10 * 1024,
        //   },
        // },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:8].css",
      chunkFilename: "css/[name].chunk.[hash:8].css",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "./src/img"),
          to: path.resolve(__dirname, "./dist/img"),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/pages/login.html",
      filename: "login.html",
      chunks: ["login"],
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
  ],
};
