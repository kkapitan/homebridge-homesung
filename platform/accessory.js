const { CommandParser } = require("./parser");

module.exports = class SamsungAccessory {
  constructor(device) {
    this.log = device.log;
    this.hap = device.hap;

    this.remote = device.remote;

    this.ip = device.config.ip;
    this.delay = device.config["delay"] || 500;

    if (device.config.isPowerCommand === true) {
      this.name = device.config.power.name || "Power TV";
      this.service = new this.hap.Service.Switch(this.name);
      this.log(`Initializing accessory ${this.name}`);

      this.service
        .getCharacteristic(this.hap.Characteristic.On)
        .on("get", this._getPower.bind(this))
        .on("set", this._setPower.bind(this));

      this.remote.onPowerStatusChanged(status => {
        this.service
          .getCharacteristic(this.hap.Characteristic.On)
          .updateValue(status);
      });
    } else {
      this.name = device.config.name;
      this.service = new this.hap.Service.Switch(this.name);
      this.log(`Initializing accessory ${this.name}`);

      this.originalCommand = device.config.command;
      this.command = CommandParser(device.config.command);

      this.service
        .getCharacteristic(this.hap.Characteristic.On)
        .on("get", this._getSwitch.bind(this))
        .on("set", this._setSwitch.bind(this));
    }
  }

  getInformationService() {
    return new this.hap.Service.AccessoryInformation()
      .setCharacteristic(this.hap.Characteristic.Name, this.name)
      .setCharacteristic(this.hap.Characteristic.Manufacturer, "Samsung TV")
      .setCharacteristic(this.hap.Characteristic.Model, "SamsungOS")
      .setCharacteristic(this.hap.Characteristic.SerialNumber, this.ip);
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
      this.log(`TV status: ${isOn ? "on" : "standby"}`);
      callback(null, isOn);
    } catch (error) {
      this.log(`Unable to determine TV status: ${isOn}`);
      callback(null, false);
    }
  }

  async _setPower(value, callback) {
    try {
      const isOn = await this.remote.isTurnedOn();
      await this.remote.setPowerStatus({ status: !isOn });
      callback(null, !isOn);
    } catch (error) {
      this.log(`Error changing TV status: ${error}`);
      callback(error);
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
};
