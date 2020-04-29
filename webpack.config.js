module.exports = {
  mode: 'production',

  // enable sourcemaps for debugging
  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.tsx'],
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },

  // Don't import paths matching these externally included resources
  // avoides undling and allows caching by browsers between builds
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
}
