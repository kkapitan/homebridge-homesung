let Hap;
const SamsungDevice = require('./device');

class SamsungPlatform {
  constructor(log, config) {
    this.log = log;
    this.devices = config.devices || [];
  }

  accessories(callback) {
    const accessoryList = this.devices
      .map(device => new SamsungDevice(this.log, Hap, device))
      .reduce((accessories, device) => [...accessories, ...device.accessories], []);

    callback(accessoryList);
  }
}

module.exports = (homebridge) => {
  Hap = homebridge.hap;

  homebridge.registerPlatform('homebridge-homesung-tv', 'SamsungTV', SamsungPlatform);
};
