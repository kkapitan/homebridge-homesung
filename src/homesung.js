const { Pairing } = require("./pairing");
const { Connection } = require("./connection");
const { InfoService } = require("./info");

class Homesung {
  constructor({ config }, logger = { error: console.error, log: console.log }) {
    this.pairing = new Pairing({ config }, logger);
    this.connection = new Connection({ config }, logger);
    this.identity = config.identity;
    this.logger = logger;
    this.infoService = new InfoService({ config });
  }

  async isTurnedOn() {
    try {
      await this.deviceInfo();
      return true;
    } catch (error) {
      return false;
    }
  }

  async deviceInfo() {
    try {
      return await this.infoService.fetchInfo();
    } catch (error) {
      throw new Error("TV is not responding");
    }
  }

  async startPairing() {
    try {
      await this.pairing.requestPin();
    } catch (error) {
      throw new Error("Unable to request PIN");
    }
  }

  async confirmPairing({ pin }) {
    try {
      const identity = await this.pairing.confirmPin({ pin });
      this.identity = identity;
      return identity;
    } catch (error) {
      throw new Error("Invalid PIN code");
    }
  }

  async sendKey({ key }) {
    try {
      if (this.identity !== undefined) {
        await this.connection.sendKey({ key, identity: this.identity });
      } else {
        throw new Error("You need to pair with your device first");
      }
    } catch (error) {
      throw new Error("Unable to send the key");
    }
  }
}

module.exports = { Homesung };
