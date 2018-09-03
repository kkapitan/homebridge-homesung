const { PairingService } = require("./service");
const { PairingProtocol } = require("./protocol");

class Pairing {
  constructor({ config }, logger) {
    this.pairingService = new PairingService({ config });
    this.pairingProtocol = new PairingProtocol();
    this.logger = logger;
  }

  async requestPin() {
    await this.pairingService.requestPin();
    await this.pairingService.startPairing();
  }

  async confirmPin({ pin }) {
    const config = this.pairingService.config;
    const serverHello = this.pairingProtocol.generateServerHello({
      userId: config.userId,
      pin
    });

    const helloData = await this.pairingService.sendServerHello({
      serverHello
    });

    const requestId = this.pairingProtocol.validateHelloData({
      data: JSON.parse(helloData.auth_data)
    });

    const serverAck = this.pairingProtocol.generateServerAck();
    const ackData = await this.pairingService.sendServerAck({
      serverAck,
      requestId
    });

    const parsedAckData = JSON.parse(ackData.auth_data);

    this.pairingProtocol.validateAckData({ data: parsedAckData });
    await this.pairingService.hidePin();

    return {
      sessionId: parsedAckData.session_id,
      aesKey: this.pairingProtocol.getKey()
    };
  }
}

module.exports = { Pairing };
