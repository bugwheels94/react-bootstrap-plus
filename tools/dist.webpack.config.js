const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = (distRoot, optimize, bundle) => ({
  plugins: bundle
    ? [
        new BundleAnalyzerPlugin({
          analyzerPort: 8188,
        }),
      ]
    : [],
  mode: 'production',
  optimization: {
    minimize: !!optimize,
    sideEffects: false,
  },
  entry: './src/index.js',
  output: {
    path: distRoot,
    filename: optimize ? 'react-bootstrap.min.js' : 'react-bootstrap.js',
    library: 'ReactBootstrap',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            envName: `dist-${optimize ? 'prod' : 'dev'}`,
          },
        },
      },
    ],
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
  },
});
