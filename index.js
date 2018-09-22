const platform = require('./platform');

module.exports = function init(homebridge) {
  platform(homebridge);
};
