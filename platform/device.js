const { Homesung } = require('../src/homesung');
const SamsungAccessory = require('./accessory');

module.exports = class SamsungDevice {
  constructor(log, hap, configuration) {
    const config = configuration;

    if (!config.ip) {
      throw new Error(`TV IP address is required for ${config.name}`);
    }

    if (!config.identity) {
      throw new Error(`Identity is required for ${config.name}`);
    }

    if (!config.identity.sessionId) {
      throw new Error(`sessionId is required for ${config.name}`);
    }

    if (!config.identity.aesKey) {
      throw new Error(`aesKey is required for ${config.name}`);
    }

    config.userId = config.userId || '654321';
    config.appId = config.appId || '721b6fce-4ee6-48ba-8045-955a539edadb';

    this.hap = hap;
    this.log = log;
    this.accessories = [];
    this.config = config;

    const debug = function debugLog(message) {
      if (config.debug) {
        log(message);
      }
    };

    this.remote = new Homesung({ config }, { log, error: log, debug });
    this.initAccessories();
  }

  initAccessories() {
    this.accessories = [
      new SamsungAccessory({
        ...this,
        config: { ...this.config, isPowerCommand: true },
      }),
    ];

    if (Array.isArray(this.config.switches)) {
      const accessories = this.config.switches.map(
        element => new SamsungAccessory({
          ...this,
          config: { ...this.config, ...element },
        }),
      );

      this.accessories = [...accessories, ...this.accessories];
    }
  }
};
