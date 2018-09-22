const fetch = require('../http/fetch');
const { HandshakeRequest, StartServiceRequest } = require('./requests');

class SocketService {
  constructor({ config }) {
    this.baseUrl = `http://${config.ip}:8000`;
  }

  async handshake() {
    const req = HandshakeRequest();
    return fetch(req, this.baseUrl);
  }

  async startService() {
    const req = StartServiceRequest();
    return fetch(req, this.baseUrl);
  }
}

module.exports = { SocketService };
