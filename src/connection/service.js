const request = require("request");
const { HandshakeRequest, StartServiceRequest } = require("./requests");

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

class SocketService {
  constructor({ config }) {
    this.baseUrl = `http://${config.ip}:8000`;
  }

  async handshake() {
    const req = HandshakeRequest();
    return await performRequest(req, this.baseUrl);
  }

  async startService() {
    const req = StartServiceRequest();
    return await performRequest(req, this.baseUrl);
  }
}

module.exports = { SocketService };
