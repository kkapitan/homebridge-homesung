const { Homesung } = require("./src/homesung");
const readline = require("readline");

const args = process.argv.slice(2);

if (args.length == 0) {
  console.error("IP address is required");
  return;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function input(prompt) {
  return new Promise(function(resolve) {
    rl.question(prompt, answer => {
      resolve(answer);
    });
  });
}

async function main() {
  const config = {
    ip: args[0],
    appId: "721b6fce-4ee6-48ba-8045-955a539edadb",
    userId: "654321"
  };

  const homesung = new Homesung({ config });

  try {
    const info = await homesung.deviceInfo();
    config.deviceId = JSON.parse(info).DeviceID;
  } catch (error) {
    throw new Error(
      "Unable to connect to the TV. Check if it is turned on and if the IP address is correct."
    );
  }

  try {
    await homesung.startPairing();
  } catch (error) {
    throw new Error(
      "Unable to start pairing with the TV. Check if it is turned on and if the IP address is correct."
    );
  }

  try {
    const pin = await input("Enter the pin displayed on the TV screen: ");
    const identity = await homesung.confirmPairing({ pin: pin });
    console.log("Pairing succeeded. Use the following info in the config.json");
    console.log(`Identity: ${JSON.stringify(identity)}`);
    console.log(`DeviceId: ${config.deviceId}`);
  } catch (error) {
    throw new Error("Incorrect PIN was supplied.");
  }
}

main()
  .then(() => process.exit())
  .catch(err => {
    console.error(err.message);
    process.exit();
  });
