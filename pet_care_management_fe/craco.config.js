module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Disable CSS minification to avoid CSS parsing errors
      if (env === 'production') {
        const minimizerIndex = webpackConfig.optimization.minimizer.findIndex(
          (minimizer) => minimizer.constructor.name === 'CssMinimizerPlugin'
        );

        if (minimizerIndex !== -1) {
          // Remove CSS minimizer completely
          webpackConfig.optimization.minimizer.splice(minimizerIndex, 1);
        }
      }

      return webpackConfig;
    },
  },
};