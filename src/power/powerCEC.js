const { PowerStatus } = require("./powerStatus");

class PowerCEC {
  constructor({ config }, logger) {
    this.cecClient = require("cec-promise");
    this.controlNibble = config.power.addressCEC;
    this.senderNibble = 14;
    this.addressByte = (this.senderNibble % 16 << 4) | this.controlNibble % 16;
    this.logger = logger;
  }

  async isTurnedOn() {
    return (await this.currentPowerStatus()) === PowerStatus.ON;
  }

  async currentPowerStatus() {
    this.logger.debug(`Requesting device status: ${this.addressByte}`);
    try {
      const response = await this.cecClient.request(
        this.addressByte,
        "GIVE_DEVICE_POWER_STATUS",
        "REPORT_POWER_STATUS"
      );

      this.logger.debug(`Response: ${response}`);
      this.logger.debug(`Response: ${JSON.stringify(response)}`);
      this.logger.debug(`Response: ${response.status}`);

      const status = response.status ? PowerStatus.ON : PowerStatus.STANDBY;
      this.logger.debug(`Requesting device status succeded: ${status}`);

      return status;
    } catch (error) {
      this.logger.debug(`Requesting device status failed: ${error.message}`);
      return PowerStatus.unknown;
    }
  }

  async setPowerStatus({ status }) {
    const currentStatus = await this.currentPowerStatus();
    if (currentStatus === status) {
      this.logger.debug(`Device is already: ${status}`);
      return;
    }

    this.logger.debug(`Changing status to: ${status}`);
    this.cecClient.send(`${status} ${this.controlNibble}`);
  }

  onPowerStatusChanged(callback) {
    this.cecClient.on(
      "REPORT_POWER_STATUS",
      function(status) {
        this.logger.debug(
          `New status arrived: ${status.source}, ${status.args[0]}`
        );
        if (status.source === this.controlNibble) {
          const newStatus = (function() {
            switch (status.args[0]) {
              case this.cecClient.code.PowerStatus.ON:
                return PowerStatus.ON;
              case this.cecClient.code.PowerStatus.STANDBY:
                return PowerStatus.STANDBY;
              default:
                return PowerStatus.UNKNOWN;
            }
          })();

          this.logger.debug(`Reporting status: ${newStatus}`);
          callback(newStatus);
        }
      }.bind(this)
    );
  }
}

module.exports = { PowerCEC };
