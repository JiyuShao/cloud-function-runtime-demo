import Webpack from 'webpack';
import getWebpackConfig from './webpack.config';

const webpackConfig = getWebpackConfig('production');
Webpack(webpackConfig, (err, stats) => {
  if (err) {
    console.error(err.stack || err);
  } else if (stats?.hasErrors()) {
    console.log(
      stats?.toString({
        colors: true,
      })
    );
    console.error('There was an error compiling, review above');
  }
});
