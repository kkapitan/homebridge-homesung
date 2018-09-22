const encryptor = require('../../vendor/encryption');

class PairingProtocol {
  static generateServerHello({ userId, pin }) {
    return encryptor.generateServerHello(userId, pin);
  }

  static generateServerAck() {
    return encryptor.generateServerAcknowledge();
  }

  static validateHelloData({ data }) {
    if (encryptor.parseClientHello(data.GeneratorClientHello) !== 0) {
      throw Error('Invalid PIN');
    }

    return data.request_id;
  }

  static validateAckData({ data }) {
    if (!encryptor.parseClientHello(data.ClientAckMsg)) {
      throw Error('Failed to acknowledge client');
    }

    return data;
  }

  static getKey() {
    return encryptor.getKey();
  }
}

module.exports = { PairingProtocol };
