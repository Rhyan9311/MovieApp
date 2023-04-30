module.exports = {
  entry: ['./client/index.js'],
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js',
  },
  context: __dirname,
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
    ],
  },
};


// const path = require("path");

// module.exports = {
//   entry: ["./client/index.js"],
//   output: {
//     path: path.resolve(__dirname, "public"),
//     filename: "bundle.js",
//   },
//   context: __dirname,
//   devtool: "source-map",
//   module: {
//     rules: [
//       {
//         test: /\.jsx?$/,
//         exclude: /node_modules/,
//         loader: "babel-loader",
//         options: {
//           presets: ["@babel/preset-env", "@babel/preset-react"],
//         },
//       },
//     ],
//   },
// };


