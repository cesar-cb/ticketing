const withImages = require('next-images');

module.exports = withImages({
  webpackDevMiddleware: config => {
    config.watchOptions.poll = 3000;
    return config;
  },
});
