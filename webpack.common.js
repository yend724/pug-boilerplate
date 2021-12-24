const path = require("path");
const glob = require("glob");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

let entries = {};
const entryFiles = glob.sync(
  `${path.resolve(__dirname, "src")}/assets/js/**.ts`
);
entryFiles.forEach((path) => {
  const key = path.match(/([^/]*)\./)[1];
  entries[key] = path;
});

const htmlFiles = glob.sync(`${path.resolve(__dirname, "src")}/**/**.html`);
const htmls = htmlFiles.map((path) => {
  return path.match(/([^/]*)\./)[1];
});

module.exports = {
  mode: "production",
  devtool: "inline-source-map",
  entry: entries,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "assets/js/[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/typescript"],
            plugins: [
              "@babel/proposal-class-properties",
              "@babel/proposal-object-rest-spread",
              "@babel/plugin-transform-runtime",
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    ...htmls.map((filename) => {
      return new HtmlWebpackPlugin({
        inject: false,
        filename: `${filename}.html`,
        template: `./src/${filename}.html`,
      });
    }),
  ],
};
