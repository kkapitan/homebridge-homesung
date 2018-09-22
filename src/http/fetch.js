const request = require('request');

const fetch = async function performRequest(req, baseUrl) {
  return new Promise((resolve, reject) => {
    req.baseUrl = baseUrl;
    request(req, (err, response, body) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(body);
    });
  });
};

module.exports = fetch;
