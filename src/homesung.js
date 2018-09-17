const { Pairing } = require("./pairing");
const { Connection } = require("./connection");
const { InfoService } = require("./info");
const { PowerCEC, PowerWiFi, PowerStatus } = require("./power");

class Homesung {
  constructor(
    { config },
    logger = { error: console.error, log: console.log, debug: console.log }
  ) {
    this.pairing = new Pairing({ config }, logger);
    this.connection = new Connection({ config }, logger);

    this.identity = config.identity;
    this.logger = logger;
    this.infoService = new InfoService({ config });

    config.power = {
      enableCEC: false,
      key: "KEY_POWEROFF",
      addressCEC: 0,
      ...config.power
    };

    if (config.power.enableCEC === true) {
      this.power = new PowerCEC({ config }, logger);
    } else {
      this.power = new PowerWiFi(
        {
          config,
          infoService: this.infoService,
          keySender: this.sendKey.bind(this)
        },
        logger
      );
    }
  }

  async isTurnedOn() {
    return await this.power.isTurnedOn();
  }

  async setPowerStatus({ status }) {
    const newStatus = status ? PowerStatus.ON : PowerStatus.STANDBY;
    await this.power.setPowerStatus({ status: newStatus });
  }

  onPowerStatusChanged(callback) {
    this.power.onPowerStatusChanged(function(status) {
      callback(status === PowerStatus.ON);
    });
  }

  async deviceInfo() {
    try {
      return await this.infoService.fetchInfo();
    } catch (error) {
      throw new Error(`Error fetching device info ${error.message}`);
    }
  }

  async startPairing() {
    await this.pairing.requestPin();
  }

  async confirmPairing({ pin }) {
    const identity = await this.pairing.confirmPin({ pin });
    this.identity = identity;
    return identity;
  }

  async sendKey({ key }) {
    try {
      if (this.identity !== undefined) {
        await this.connection.sendKey({ key, identity: this.identity });
      } else {
        throw new Error("You need to pair with your device first");
      }
    } catch (error) {
      throw new Error(`Unable to send the key: ${error.message}`);
    }
  }
}

module.exports = { Homesung };
