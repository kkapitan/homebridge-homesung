const { Homesung } = require("./src/homesung");

const args = process.argv.slice(2);

const config = {
  ip: "192.168.0.5",
  appId: "721b6fce-4ee6-48ba-8045-955a539edadb",
  userId: "654321",
  deviceId: "05f5e101-0064-1000-bc6f-bc148579b986"
};

const homesung = new Homesung({ config });

if (args[0]) {
  homesung.confirmPairing({ pin: args[0] });
} else {
  homesung.startPairing();
}
