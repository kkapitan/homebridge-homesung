const fetch = require('../http/fetch');
const {
  PinRequest,
  StartPairingRequest,
  SendServerAckRequest,
  SendServerHelloRequest,
  HidePinRequest,
} = require('./requests');

class PairingService {
  constructor({ config }) {
    this.config = config;
    this.baseUrl = `http://${config.ip}:8080`;
  }

  async requestPin() {
    const req = PinRequest();
    return fetch(req, this.baseUrl);
  }

  async startPairing() {
    const req = StartPairingRequest({
      config: this.config,
    });
    return fetch(req, this.baseUrl);
  }

  async sendServerHello({ serverHello }) {
    const req = SendServerHelloRequest({
      config: this.config,
      serverHello,
    });
    return fetch(req, this.baseUrl);
  }

  async sendServerAck({ serverAck, requestId }) {
    const req = SendServerAckRequest({
      config: this.config,
      requestId,
      serverAck,
    });
    return fetch(req, this.baseUrl);
  }

  async hidePin() {
    const req = HidePinRequest();
    return fetch(req, this.baseUrl);
  }
}

module.exports = { PairingService };
