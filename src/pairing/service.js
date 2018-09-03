const request = require("request");
const {
  PinRequest,
  StartPairingRequest,
  SendServerAckRequest,
  SendServerHelloRequest,
  HidePinRequest
} = require("./requests");

const performRequest = async function(req, baseUrl) {
  return new Promise(function(resolve, reject) {
    req.baseUrl = baseUrl;
    request(req, function(err, response, body) {
      if (err) {
        reject(err);
        return;
      }
      resolve(body);
    });
  });
};

class PairingService {
  constructor({ config }) {
    this.config = config;
    this.baseUrl = `http://${config.ip}:8080`;
  }

  async requestPin() {
    const req = PinRequest();
    return await performRequest(req, this.baseUrl);
  }

  async startPairing() {
    const req = StartPairingRequest({
      config: this.config
    });
    return await performRequest(req, this.baseUrl);
  }

  async sendServerHello({ serverHello }) {
    const req = SendServerHelloRequest({
      config: this.config,
      serverHello
    });
    return await performRequest(req, this.baseUrl);
  }

  async sendServerAck({ serverAck, requestId }) {
    const req = SendServerAckRequest({
      config: this.config,
      requestId,
      serverAck
    });
    return await performRequest(req, this.baseUrl);
  }

  async hidePin() {
    const req = HidePinRequest();
    return await performRequest(req, this.baseUrl);
  }
}

module.exports = { PairingService };
