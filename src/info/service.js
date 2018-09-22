const { InfoRequest } = require('./requests');
const fetch = require('../http/fetch');

class InfoService {
  constructor({ config }) {
    this.baseUrl = `http://${config.ip}:8001`;
  }

  async fetchInfo() {
    const req = InfoRequest();
    await fetch(req, this.baseUrl);
  }
}

module.exports = { InfoService };
