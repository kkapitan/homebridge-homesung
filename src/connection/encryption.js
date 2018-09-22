const encryptor = require('../../vendor/encryption');

class Encryption {
  constructor({ identity }) {
    this.identity = identity;
  }

  encrypt(data) {
    return encryptor.encryptData(this.identity.aesKey, this.identity.sessionId, data);
  }

  decrypt(data) {
    return encryptor.decryptData(this.identity.aesKey, data);
  }
}

module.exports = { Encryption };
