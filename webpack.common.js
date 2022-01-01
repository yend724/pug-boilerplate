const path = require("path");
const glob = require("glob");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

let entries = {};
const entryFiles = glob.sync(
  `${path.resolve(__dirname, "src")}/assets/js/**.ts`
);
entryFiles.forEach(path => {
  const key = path.match(/([^/]*)\./)[1];
  entries[key] = path;
});

const pugFiles = glob.sync(`${path.resolve(__dirname, "src/pug")}/**/**.pug`, {
  ignore: "**/_*.pug",
});
const pugs = pugFiles.map(p => {
  return p
    .replace(path.resolve(__dirname, "src/pug") + "/", "")
    .replace(".pug", "");
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
      {
        test: /\.pug$/,
        use: [
          {
            loader: "pug-loader",
            options: {
              pretty: true,
            },
          },
        ],
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
    ...pugs.map(filename => {
      return new HtmlWebpackPlugin({
        inject: false,
        filename: `${filename}.html`,
        template: `./src/pug/${filename}.pug`,
      });
    }),
  ],
};
