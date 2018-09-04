const request = require("request");
const { InfoRequest } = require("./requests");

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

class InfoService {
  constructor({ config }) {
    this.baseUrl = `http://${config.ip}:8001`;
  }

  async fetchInfo() {
    const req = InfoRequest();
    return await performRequest(req, this.baseUrl);
  }
}

module.exports = { InfoService };
