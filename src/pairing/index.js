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

    this.logger.log(
      `Confirming pin with config: ${JSON.stringify(config)} and pin: ${pin}`
    );

    const serverHello = this.pairingProtocol.generateServerHello({
      userId: config.userId,
      pin
    });

    this.logger.log(`Sending server hello ${serverHello}`);

    const helloData = await this.pairingService.sendServerHello({
      serverHello
    });

    this.logger.log(`Received server hello ${helloData}`);

    const parsedHelloData = JSON.parse(helloData);

    this.logger.log(
      `Parsing server hello auth data ${parsedHelloData.auth_data}`
    );

    const parsedHelloAuthData = JSON.parse(parsedHelloData.auth_data);

    this.logger.log(
      `Validating server hello auth data ${
        parsedHelloAuthData.GeneratorClientHello
      }`
    );

    const requestId = this.pairingProtocol.validateHelloData({
      data: parsedHelloAuthData
    });

    this.logger.log(`Obtained requestId ${requestId}`);

    const serverAck = this.pairingProtocol.generateServerAck();

    this.logger.log(`Sending server acknowledge ${serverAck}`);

    const ackData = await this.pairingService.sendServerAck({
      serverAck,
      requestId
    });

    this.logger.log(`Received client acknowledge ${ackData}`);

    const parsedAckData = JSON.parse(ackData);

    this.logger.log(`Parsing acknowledge auth data ${parsedAckData.auth_data}`);

    const parsedAckAuthData = JSON.parse(parsedAckData.auth_data);

    this.logger.log(
      `Validating acknowledge auth data ${parsedAckAuthData.ClientAckMsg}`
    );

    this.pairingProtocol.validateAckData({
      data: parsedAckAuthData
    });
    await this.pairingService.hidePin();

    return {
      sessionId: parsedAckAuthData.session_id,
      aesKey: this.pairingProtocol.getKey()
    };
  }
}

module.exports = { Pairing };
