const { SocketService } = require("./service");
const { SocketConnection, SocketConnectionState } = require("./connection");
const { SendKeyMessage } = require("./messages");
const {
  CommandsMessageHandler,
  InitialMessageHandler,
  KeepAliveMessageHandler
} = require("./handlers");

class Connection {
  constructor({ config }, logger) {
    this.socketUrl = `ws://${config.ip}:8000/socket.io/1/websocket/`;
    this.socketService = new SocketService({ config });
    this.logger = logger;
  }

  async connect({ identity }) {
    await this.socketService.startService();
    const handshake = await this.socketService.handshake();
    const mask = handshake.split(":")[0];

    const baseUrl = this.socketUrl + mask;

    return new Promise(
      function(resolve, reject) {
        this.socketConnection = new SocketConnection(
          { baseUrl, identity },
          function(state, payload) {
            switch (state) {
              case SocketConnectionState.DISCONNECTED:
                this.logger.log("DISCONNECTED");
                this.DUID = undefined;
                this.socketConnection = undefined;
                break;
              case SocketConnectionState.CONNECTED:
                this.logger.log("CONNECTED");
                this.DUID = payload;
                resolve();
                break;
              case SocketConnectionState.CONNECTING:
                this.logger.log("CONNECTING");
                break;
              default:
                this.logger.log("UNKNOWN STATE");
                reject();
            }
          }.bind(this)
        );

        this.socketConnection.register(InitialMessageHandler());
        this.socketConnection.register(KeepAliveMessageHandler());
        this.socketConnection.register(CommandsMessageHandler());

        this.socketConnection.connect();
      }.bind(this)
    );
  }

  async sendKey({ key, identity }) {
    if (!this.isConnected() && !this.isConnecting()) {
      await this.connect({ identity });
    }

    const message = SendKeyMessage({ key, duid: this.DUID });
    this.socketConnection.send({ topic: "5::/com.samsung.companion", message });
  }

  isConnected() {
    return this.DUID !== undefined;
  }

  isConnecting() {
    return this.socketConnection !== undefined;
  }
}

module.exports = { Connection };
