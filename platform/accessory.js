const { CommandParser } = require("./parser");

module.exports = class SamsungAccessory {
  constructor(device) {
    this.log = device.log;
    this.hap = device.hap;
    this.config = device.config;

    this.delay = device.config["delay"] || 500;

    this.remote = device.remote;
    this.name = device.config.name;

    this.originalCommand = device.config.command;
    this.command = CommandParser(device.config.command);

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
      for (const step of this.command) {
        const delay = step.delay || this.delay;

        await this.remote.sendKey({ key: step.key });
        await this._wait(delay);
      }

      setTimeout(
        () =>
          this.service
            .getCharacteristic(this.hap.Characteristic.On)
            .updateValue(false),
        100
      );
    } catch (error) {
      this.log(`Error sending key: ${error}`);

      setTimeout(
        () =>
          this.service
            .getCharacteristic(this.hap.Characteristic.On)
            .updateValue(false),
        100
      );
    } finally {
      callback();
    }
  }

  async _getPower(callback) {
    try {
      const isOn = await this.remote.isTurnedOn();
      this.log(`TV is on: ${isOn}`);
      callback(null, isOn);
    } catch (error) {
      this.log(`TV is powered off: ${error}`);
      callback(null, false);
    }
  }

  async _setPower(value, callback) {
    try {
      if (await this.remote.isTurnedOn()) {
        await this.remote.sendKey({ key: this.originalCommand });
      }
    } catch (error) {
      this.log(`Error powering off: ${error}`);
    } finally {
      callback();
    }
  }

  _wait(ms) {
    return new Promise(resolve => {
      if (ms <= 0) {
        resolve();
      } else {
        setTimeout(resolve, ms);
      }
    });
  }

  isPowerCommand() {
    return (
      this.originalCommand === "KEY_POWEROFF" ||
      this.originalCommand === "KEY_POWER"
    );
  }
};
