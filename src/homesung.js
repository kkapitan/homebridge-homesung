const { Pairing } = require("./pairing");
const { Connection } = require("./connection");

class Homesung {
  constructor({ config }, logger = { error: console.error, log: console.log }) {
    this.pairing = new Pairing({ config }, logger);
    this.connection = new Connection({ config }, logger);
    this.identity = config.identity;
    this.logger = logger;
  }

  startPairing() {
    this.pairing
      .requestPin()
      .then(() => this.logger.log("Showing PIN code"))
      .catch(this.logger.error);
  }

  confirmPairing({ pin }) {
    this.pairing
      .confirmPin({ pin })
      .then(identity => {
        this.identity = identity;
        this.logger.log(
          `PIN Code confirmed ${identity.sessionId} ${identity.aesKey}`
        );
      })
      .catch(err => {
        this.logger.error(err);
      });
  }

  sendKey({ key }) {
    if (this.identity !== undefined) {
      this.connection
        .sendKey({ key, identity: this.identity })
        .then(() => this.logger.log(`Key ${key} was sent`))
        .catch(this.logger.error);
    } else {
      this.logger.error("You need to pair with your device first");
    }
  }
}

module.exports = { Homesung };
