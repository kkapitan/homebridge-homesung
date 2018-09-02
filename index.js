const { Homesung } = require("./src/homesung");

const args = process.argv.slice(2);

const device = {
  DUID: "05f5e101-0064-1000-bc6f-bc148579b986",
  Model: "14_X14_BT",
  ModelName: "UE48H6400",
  ModelDescription: "Samsung TV RCR",
  NetworkType: "wireless",
  SSID: "Internet Domowy-020358",
  IP: "192.168.0.5",
  FirmwareVersion: "Unknown",
  DeviceName: "[TV]Samsung LED48",
  deviceId: "05f5e101-0064-1000-bc6f-bc148579b986",
  UDN: "05f5e101-0064-1000-bc6f-bc148579b986",
  Resolution: "1920x1080",
  CountryCode: "PL",
  SmartHubAgreement: "true",
  ServiceURI: "http://192.168.0.5:8001/ms/1.0/",
  DialURI: "http://192.168.0.5:8001/ws/apps/",
  Capabilities: [
    {
      name: "samsung:multiscreen:1",
      port: "8001",
      location: "/ms/1.0/"
    }
  ]
};

const config = {
  ip: "192.168.0.5",
  appId: "721b6fce-4ee6-48ba-8045-955a539edadb",
  userId: "654321"
};

const homesung = new Homesung({ config, device });

console.log(args);
if (args[0]) {
  homesung.confirmPairing({ pin: args[0] }, function(err) {
    console.log("SENDING KEY");
    homesung.sendKey({ key: "KEY_MUTE" });
  });
} else {
  homesung.startPairing();
}
