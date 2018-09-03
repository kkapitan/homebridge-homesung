module.exports = class SamsungAccessory {
  constructor(device) {
    this.log = device.log;
    this.hap = device.hap;
    this.config = device.config;
    this.remote = device.remote;
    this.name = device.config.name;
    this.key = device.config.key;

    this.service = new this.hap.Service.Switch(this.name);

    this.log(`Initializing accessory ${this.name}`);

    this.service
      .getCharacteristic(this.hap.Characteristic.On)
      .on("get", this._getSwitch.bind(this))
      .on("set", this._setSwitch.bind(this));
  }

  getInformationService() {
    return new this.hap.Service.AccessoryInformation()
      .setCharacteristic(this.hap.Characteristic.Name, this.config.name)
      .setCharacteristic(this.hap.Characteristic.Manufacturer, "Samsung TV")
      .setCharacteristic(this.hap.Characteristic.Model, "SamsungOS")
      .setCharacteristic(this.hap.Characteristic.SerialNumber, this.config.ip);
  }

  getServices() {
    return [this.service, this.getInformationService()];
  }

  async _getSwitch(callback) {
    callback(null, false);
  }

  async _setSwitch(value, callback) {
    try {
      this.remote.sendKey({ key: this.key });
    } catch (error) {
      this.log(`Error: ${error}`);

      setTimeout(
        () =>
          this.service
            .getCharacteristic(this.hap.Characteristic.On)
            .updateValue(!value),
        100
      );
    } finally {
      callback();
    }
  }
};
