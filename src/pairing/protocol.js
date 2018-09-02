const encryptor = require("../../vendor/encryption");

class PairingProtocol {
  generateServerHello({ userId, pin }) {
    return encryptor.generateServerHello(userId, pin);
  }

  generateServerAck() {
    return encryptor.generateServerAcknowledge();
  }

  validateHelloData({ data }) {
    if (encryptor.parseClientHello(data.GeneratorClientHello) !== 0) {
      throw Error("Invalid PIN");
    }

    return data.request_id;
  }

  validateAckData({ data }) {
    if (!encryptor.parseClientHello(data.ClientAckMsg)) {
      throw Error("Failed to acknowledge client");
    }

    return data;
  }

  getKey() {
    return encryptor.getKey();
  }
}

module.exports = { PairingProtocol };
