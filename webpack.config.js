const Path = require("path");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env) => {
  const isDevelopment = !!env.WEBPACK_SERVE;

  let plugins = [
    new HtmlWebpackPlugin({
      title: "Eluvio Stream Sample",
      template: Path.join(__dirname, "src", "index.html"),
      cache: false,
      filename: "index.html",
      favicon: "./src/assets/icons/favicon.png"
    }),
    new CopyWebpackPlugin([
      {
        from: Path.join(__dirname, "src/main/static/images/logos/eluvio-logo.svg"),
        to: Path.join(__dirname, "dist", "logo.svg")
      },
      {
        from: Path.join(__dirname, "src/main/static/images/logos/eluvio-logo-color.png"),
        to: Path.join(__dirname, "dist", "logo-color.png")
      },
      {
        from: Path.join(__dirname, "src/main/static/documents/PrivacyPolicy.html"),
        to: Path.join(__dirname, "dist", "EluvioPrivacyPolicy.html")
      },
      {
        from: Path.join(__dirname, "src/main/static/documents/Terms.html"),
        to: Path.join(__dirname, "dist", "EluvioTerms.html")
      }
    ]),
  ];

  if(isDevelopment) {
    plugins.push(new ReactRefreshWebpackPlugin({overlay: false}));
  }

  if(process.env.ANALYZE_BUNDLE) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return {
    entry: "./src/App.js",
    target: "web",
    output: {
      path: Path.resolve(__dirname, "dist"),
      clean: true,
      filename: "App.js",
      chunkFilename: "bundle.[id].[chunkhash].js"
    },
    snapshot: {
      managedPaths: [],
    },
    watchOptions: {
      followSymlinks: true,
    },
    devServer: {
      hot: true,
      client: {
        //webSocketURL: "auto://elv-test.io/ws",
        overlay: false
      },
      https: {
        key: fs.readFileSync("./https/private.key"),
        cert: fs.readFileSync("./https/dev.local.crt"),
        ca: fs.readFileSync("./https/private.pem")
      },
      historyApiFallback: true,
      allowedHosts: "all",
      port: 8086,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Accept",
        "Access-Control-Allow-Methods": "POST"
      },
      // This is to allow configuration.js to be accessed
      static: {
        directory: Path.resolve(__dirname, "./config"),
        publicPath: "/"
      }
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
      fallback: {
        stream: require.resolve("stream-browserify"),
        url: require.resolve("url")
      },
      extensions: [".js", ".jsx", ".mjs", ".scss", ".png", ".svg"],
    },
    mode: "development",
    devtool: "eval-source-map",
    plugins,
    externals: {
      crypto: "crypto"
    },
    module: {
      rules: [
        {
          test: /\.(theme|font)\.(css|scss)$/i,
          type: "asset/source"
        },
        {
          test: /\.(css|scss)$/,
          exclude: /\.(theme|font)\.(css|scss)$/i,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 2,
                modules: {
                  mode: "local",
                  auto: true,
                  localIdentName: isDevelopment ?  "[local]--[hash:base64:5]" : "[hash:base64:5]"
                }
              }
            },
            "postcss-loader",
            "sass-loader"
          ]
        },
        {
          test: /\.(js|mjs|jsx)$/,
          loader: "babel-loader",
          options: {
            plugins: [isDevelopment && require.resolve("react-refresh/babel")].filter(Boolean),
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
            ]
          }
        },
        {
          test: /\.svg$/,
          loader: "svg-inline-loader"
        },
        {
          test: /\.(gif|png|jpe?g|otf|woff2?|ttf)$/i,
          include: [Path.resolve(__dirname, "src/static/public")],
          type: "asset/inline",
          generator: {
            filename: "public/[name][ext]"
          }
        },
        {
          test: /\.(gif|png|jpe?g|otf|woff2?|ttf)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(txt|bin|abi|csv|mp4|pdf)$/i,
          type: "asset/source"
        },
        {
          test: /\.html$/,
          exclude: /index\.html/,
          type: 'asset/source'
        },
        {
          test: /\.ya?ml$/,
          use: "yaml-loader"
        }
      ]
    }
  };
};

