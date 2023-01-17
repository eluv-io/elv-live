const webpack = require("webpack");
const Path = require("path");
const autoprefixer = require("autoprefixer");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
//const TerserPlugin = require("terser-webpack-plugin");
const fs = require("fs");
// entry: "./src/components/original/index.js",

module.exports = {
  entry: "./src/App.js",
  target: "web",
  output: {
    path: Path.resolve(__dirname, "dist"),
    filename: "App.js",
    chunkFilename: "[name].bundle.js",
    publicPath: "/"
  },
  devServer: {
    public: "elv-test.io",
    https: {
      key: fs.readFileSync("./https/private.key"),
      cert: fs.readFileSync("./https/dev.local.crt"),
      ca: fs.readFileSync("./https/private.pem")
    },
    disableHostCheck: true,
    inline: true,
    port: 8086,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Allow-Methods": "POST"
    },
    historyApiFallback: true
  },
  resolve: {
    alias: {
      Assets: Path.resolve(__dirname, "src/assets"),
      Data: Path.resolve(__dirname, "src/assets/data"),
      Icons: Path.resolve(__dirname, "src/assets/icons"),
      Styles: Path.resolve(__dirname, "src/assets/styles"),
      Images: Path.resolve(__dirname, "src/assets/images"),
      Components: Path.resolve(__dirname, "src/components"),
      Layout: Path.resolve(__dirname, "src/components/layout"),
      Common: Path.resolve(__dirname, "src/components/common"),
      Pages: Path.resolve(__dirname, "src/pages"),
      Code: Path.resolve(__dirname, "src/pages/code"),
      Confirmation: Path.resolve(__dirname, "src/pages/confirmation"),
      Event: Path.resolve(__dirname, "src/pages/event"),
      Stream: Path.resolve(__dirname, "src/pages/stream"),
      Support: Path.resolve(__dirname, "src/pages/support"),
      Stores: Path.resolve(__dirname, "src/stores"),
      Utils: Path.resolve(__dirname, "src/utils"),
      EluvioConfiguration: Path.resolve(__dirname, "configuration.js"),
    },
    extensions: [".js", ".jsx", ".scss", ".png", ".svg"]
  },
  optimization: {
    providedExports: true,
    usedExports: true,
    splitChunks: {
      chunks: "all"
    }
  },
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  },
  mode: "development",
  devtool: "eval-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      title: "Eluvio Stream Sample",
      template: Path.join(__dirname, "src", "index.html"),
      cache: false,
      filename: "index.html",
      favicon: "./src/assets/icons/favicon.png"
    }),
    process.env.ANALYZE_BUNDLE ? new BundleAnalyzerPlugin() : undefined
  ].filter(item => item),
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        exclude: /\.(theme|font)\.(css|scss)$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [autoprefixer({})]
            }
          },
          "sass-loader"
        ],

      },
      {
        test: /\.(theme|font)\.(css|scss)$/i,
        loader: "raw-loader"
      },
      {
        test: /\.(js|mjs)$/,
        exclude: /node_modules\/(?!elv-components-js)/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react", "babel-preset-mobx"],
        }
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader"
      },
      {
        test: /\.(otf|woff2?|ttf)$/i,
        loader: "file-loader",
      },
      {
        test: /\.(pdf)$/i,
        loader: "file-loader",
        options: {
          name(resourcePath) {
            // Retain filename for PDF links
            return resourcePath.split("/").slice(-1)[0];
          },
        }
      },
      {
        test: /\.(gif|png|jpe?g)$/i,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader"
          },
        ],
      },
      {
        test: /\.(html|txt|bin|abi|md)$/i,
        loader: "raw-loader"
      },
      {
        test: /\.ya?ml$/,
        type: "json", // Required by Webpack v4
        use: "yaml-loader"
      }
    ]
  }
};

