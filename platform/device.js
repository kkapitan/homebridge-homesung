let { Homesung } = require("../src/homesung");
let SamsungAccessory = require("./accessory");

module.exports = class SamsungDevice {
  constructor(log, hap, config) {
    if (!config.ip) {
      throw new Error(`TV IP address is required for ${config["name"]}`);
    }

    if (!config.identity) {
      throw new Error(`Identity is required for ${config["name"]}`);
    }

    if (!config.identity.sessionId) {
      throw new Error(`sessionId is required for ${config["name"]}`);
    }

    if (!config.identity.aesKey) {
      throw new Error(`aesKey is required for ${config["name"]}`);
    }

    config["userId"] = config["userId"] || "654321";
    config["appId"] = config["appId"] || "721b6fce-4ee6-48ba-8045-955a539edadb";

    this.hap = hap;
    this.log = log;
    this.accessories = [];
    this.config = config;

    const debugLog = function(message) {
      config["debug"] === true && log(message);
    };

    this.remote = new Homesung(
      { config },
      { log: log, error: log, debug: debugLog }
    );
    this.initAccessories();
  }

  initAccessories() {
    this.accessories = [];

    if (Array.isArray(this.config["switches"])) {
      for (let element of this.config["switches"]) {
        this.accessories.push(
          new SamsungAccessory(
            { ...this, config: { ...this.config, ...element } },
            "switch"
          )
        );
      }
    }
  }
};
