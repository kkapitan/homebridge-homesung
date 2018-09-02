const { Pairing } = require("./pairing");
const { Connection } = require("./connection");

class Homesung {
  constructor({ config, device }) {
    this.pairing = new Pairing({ config, device });
    this.connection = new Connection({ config });
  }

  startPairing() {
    this.pairing
      .requestPin()
      .then(() => console.log("Showing PIN code"))
      .catch(console.error);
  }

  confirmPairing({ pin }, callback) {
    this.pairing
      .confirmPin({ pin })
      .then(identity => {
        this.identity = identity;
        console.log(
          `PIN Code confirmed ${identity.sessionId} ${identity.aesKey}`
        );
        callback(null);
      })
      .catch(err => {
        console.error(err);
        callback(err);
      });
  }

  sendKey({ key }) {
    if (this.identity !== undefined) {
      this.connection
        .sendKey({ key, identity: this.identity })
        .then(() => console.log(`Key ${key} was sent`))
        .catch(console.error);
    } else {
      console.error("You need to pair with your device first");
    }
  }
}

module.exports = { Homesung };
