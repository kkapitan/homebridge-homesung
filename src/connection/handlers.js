const { PushMessage, GetDUIDMessage } = require('./messages');

function InitialMessageHandler(logger) {
  return {
    shouldHandleMessage({ message }) {
      return message === '1::';
    },
    handleMessage({ message, socket }) {
      logger.debug('Handling initial message');

      socket.send({ topic: '1::/com.samsung.companion' });

      socket.send({
        topic: '5::/com.samsung.companion',
        message: PushMessage({ plugin: 'SecondTV' }),
      });
      socket.send({
        topic: '5::/com.samsung.companion',
        message: PushMessage({ plugin: 'RemoteControl' }),
      });
      socket.send({
        topic: '5::/com.samsung.companion',
        message: GetDUIDMessage(),
      });
    },
  };
}

function KeepAliveMessageHandler(logger) {
  return {
    shouldHandleMessage({ message }) {
      return message === '2::';
    },
    handleMessage({ message, socket }) {
      logger.debug('Handling keep alive');

      socket.send({ topic: '2::' });
    },
  };
}

function CommandsMessageHandler(logger) {
  return {
    shouldHandleMessage({ message }) {
      return message.startsWith('5::/com.samsung.companion:');
    },
    handleMessage({ message, socket }) {
      const payload = JSON.parse(message.slice('5::/com.samsung.companion:'.length));

      logger.debug(`Handling message: ${message}`);

      const decrypted = JSON.parse(socket.encryption.decrypt(payload.args));
      logger.debug(`Decrypted message: ${JSON.stringify(decrypted)}`);

      if (
        payload.name === 'receiveCommon'
        && decrypted.plugin === 'NNavi'
        && decrypted.api === 'GetDUID'
      ) {
        return { DUID: decrypted.result };
      }
      return undefined;
    },
  };
}

module.exports = {
  CommandsMessageHandler,
  KeepAliveMessageHandler,
  InitialMessageHandler,
};
