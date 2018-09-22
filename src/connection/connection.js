const WebSocket = require('ws');
const { Encryption } = require('./encryption');

const SocketConnectionState = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
};

class SocketConnection {
  constructor({ baseUrl, identity }, onStateChanged) {
    this.baseUrl = baseUrl;
    this.onStateChanged = onStateChanged;
    this.encryption = new Encryption({ identity });
    this.messageHandlers = [];
  }

  connect() {
    const socket = new WebSocket(this.baseUrl);
    socket.on(
      'open',
      () => {
        this.onStateChanged(SocketConnectionState.CONNECTING);
      },
    );

    socket.on(
      'message',
      (message) => {
        const handler = this.messageHandlers.find(el => el.shouldHandleMessage({ message }));

        if (handler !== undefined) {
          const payload = handler.handleMessage({ message, socket: this });
          if (payload !== undefined && payload.DUID !== undefined) {
            this.onStateChanged(SocketConnectionState.CONNECTED, payload.DUID);
          }
        }
      },
    );

    socket.on(
      'close',
      () => {
        this.onStateChanged(SocketConnectionState.DISCONNECTED);
      },
    );

    this.socket = socket;
  }

  send({ topic, message }) {
    if (message !== undefined && message.name !== undefined && message.payload !== undefined) {
      const { name, payload } = message;
      const encryptedBody = this.encryption.encrypt(payload);
      const encryptedMessage = { name, args: [encryptedBody] };

      this.socket.send(`${topic}:${JSON.stringify(encryptedMessage)}`);
    } else {
      this.socket.send(topic);
    }
  }

  register(messageHandler) {
    this.messageHandlers.push(messageHandler);
  }
}

module.exports = { SocketConnection, SocketConnectionState };
