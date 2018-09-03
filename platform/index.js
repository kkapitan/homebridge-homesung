let Hap;
const SamsungDevice = require("./device");

module.exports = homebridge => {
  Hap = homebridge.hap;

  homebridge.registerPlatform(
    "homebridge-homesung",
    "SamsungTV",
    SamsungPlatform
  );
};

class SamsungPlatform {
  constructor(log, config) {
    this.log = log;
    this.devices = config["devices"] || [];
  }

  accessories(callback) {
    let accessoryList = [];

    for (let device of this.devices) {
      device = new SamsungDevice(this.log, Hap, device);
      accessoryList = [...accessoryList, ...device.accessories];
    }

    callback(accessoryList);
  }
}
