const path = require("path")
const DeclarationBundler = require("webpack-plugin-typescript-declaration-bundler")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin

module.exports = env => {
  if (env === undefined) {
    env = { development: true }
  }
  console.log("env:", env)
  return {
    entry: "./src/index.ts",
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "lib"),
      library: "cardsgameClient",
      libraryTarget: "umd"
    },
    mode: env && env.development ? "development" : "production",
    devtool: "inline-source-map",
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        openAnalyzer: false
      })
    ],
    resolve: {
      extensions: [".ts", ".js"]
    }
  }
}
