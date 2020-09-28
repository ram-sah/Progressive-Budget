/* eslint-disable camelcase */
const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  entry: {
    app: "./public/index.js"
  },
  output: {
    path: __dirname + "/public/dist",
    filename: "bundle.js"
  },
  mode: "production",
  plugins: [
    new WebpackPwaManifest({
      fingerprints: false,
      inject: false,
      name: "Budget Tracker",
      short_name: "Budget Tracker",
      description: "An application for tracking your budget",
      background_color: "#01579b",
      theme_color: "#ffffff",
      start_url: "/",
      icons: [
        {
          src: path.resolve("./public/dist/icons/icon-128x128.png"),
          sizes: [96, 128, 192, 256, 384, 512],
          destination: path.join("dist", "icons")
        }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};

module.exports = config;
