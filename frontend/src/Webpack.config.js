module.exports = {
  // Other configurations like entry, output, etc.
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: /node_modules/, // Ignore all source maps in node_modules
      },
    ],
  },
};
