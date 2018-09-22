const { PowerStatus } = require('./powerStatus');

function statusConverter(status) {
  switch (status.args[0]) {
    case this.cecClient.code.PowerStatus.ON:
      return PowerStatus.ON;
    case this.cecClient.code.PowerStatus.STANDBY:
      return PowerStatus.STANDBY;
    default:
      return PowerStatus.UNKNOWN;
  }
}

class PowerCEC {
  constructor({ config }, logger) {
    /*
     * This needs to be lazily required since the dependency assumes
     * cec-client is installed which may not always be a case.
     */

    // eslint-disable-next-line global-require
    this.cecClient = require('cec-promise');

    this.controlNibble = config.power.addressCEC;
    this.senderNibble = 14;

    // eslint-disable-next-line no-bitwise
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
        'GIVE_DEVICE_POWER_STATUS',
        'REPORT_POWER_STATUS',
      );

      const status = response.status ? PowerStatus.STANDBY : PowerStatus.ON;
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
    const convertStatus = statusConverter.bind(this);

    this.cecClient.on('REPORT_POWER_STATUS', (status) => {
      this.logger.debug(`New status arrived: ${status.source}, ${status.args[0]}`);
      if (Number(status.source) === this.controlNibble) {
        const convertedStatus = convertStatus(status);

        this.logger.debug(`Reporting status: ${convertedStatus}`);
        callback(convertedStatus);
      }
    });
  }
}

module.exports = { PowerCEC };
