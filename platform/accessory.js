const { CommandParser } = require("./parser");

module.exports = class SamsungAccessory {
  constructor(device) {
    this.log = device.log;
    this.hap = device.hap;
    this.config = device.config;

    this.remote = device.remote;
    this.name = device.config.name;

    this.command = device.config.command;
    this.keySequence = CommandParser(this.command);

    this.service = new this.hap.Service.Switch(this.name);

    this.log(`Initializing accessory ${this.name}`);

    if (this.isPowerCommand()) {
      this.service
        .getCharacteristic(this.hap.Characteristic.On)
        .on("get", this._getPower.bind(this))
        .on("set", this._setPower.bind(this));
    } else {
      this.service
        .getCharacteristic(this.hap.Characteristic.On)
        .on("get", this._getSwitch.bind(this))
        .on("set", this._setSwitch.bind(this));
    }
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
      await this.remote.sendKey({ key: this.keySequence[0] });
      const remainingKeys = this.keySequence.slice(1);
      for (const key of remainingKeys) {
        await this._delay(500);
        await this.remote.sendKey({ key: key });
      }

      setTimeout(
        () =>
          this.service
            .getCharacteristic(this.hap.Characteristic.On)
            .updateValue(!value),
        100
      );
    } catch (error) {
      this.log(`Error sending key: ${error}`);

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

  async _getPower(callback) {
    try {
      await this.remote.deviceInfo();
      callback(null, true);
    } catch (error) {
      this.log(`TV is powered off: ${error}`);
      callback(null, false);
    }
  }

  async _setPower(value, callback) {
    try {
      if (!value) {
        await this.remote.sendKey({ key: this.command });
      }
    } catch (error) {
      this.log(`Error powering off: ${error}`);
    } finally {
      callback();
    }
  }

  _delay(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  isPowerCommand() {
    return this.command === "KEY_POWEROFF";
  }
};
