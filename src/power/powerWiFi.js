const { PowerStatus } = require("./powerStatus");

class PowerWiFi {
  constructor({ config, keySender, infoService }, logger) {
    this.key = config.power.key;
    this.keySender = keySender;
    this.infoService = infoService;
    this.logger = logger;
  }

  async isTurnedOn() {
    return (await this.currentPowerStatus()) === PowerStatus.ON;
  }

  async currentPowerStatus() {
    this.logger.debug(`Requesting device status`);
    try {
      await this.infoService.fetchInfo();
      this.logger.debug(`Requesting device status succeded: on`);
      return PowerStatus.ON;
    } catch (error) {
      this.logger.debug(`Requesting device status failed: ${error.message}`);
      return PowerStatus.STANDBY;
    }
  }

  async setPowerStatus({ status }) {
    const currentStatus = await this.currentPowerStatus();
    if (currentStatus === status) {
      this.logger.debug(`Device is already: ${status}`);
      return;
    }

    if (status === PowerStatus.STANDBY) {
      this.logger.debug(`Setting device to: ${status}`);
      await this.keySender({ key: this.key });
    } else {
      this.logger.error(`Power via WIFI does not support powering on`);
    }
  }

  onPowerStatusChanged(callback) {}
}

module.exports = { PowerWiFi };
