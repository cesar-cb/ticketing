const withImages = require('next-images');

module.exports = withImages({
  webpackDevMiddleware: config => {
    // eslint-disable-next-line no-param-reassign
    config.watchOptions.poll = 3000;
    return config;
  },
});
