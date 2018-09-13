const { PushMessage, GetDUIDMessage } = require("./messages");

const InitialMessageHandler = function(logger) {
  return {
    shouldHandleMessage: function({ message }) {
      return message === "1::";
    },
    handleMessage: function({ message, socket }) {
      logger.debug(`Handling initial message`);

      socket.send({ topic: "1::/com.samsung.companion" });

      socket.send({
        topic: "5::/com.samsung.companion",
        message: PushMessage({ plugin: "SecondTV" })
      });
      socket.send({
        topic: "5::/com.samsung.companion",
        message: PushMessage({ plugin: "RemoteControl" })
      });
      socket.send({
        topic: "5::/com.samsung.companion",
        message: GetDUIDMessage()
      });
    }
  };
};

const KeepAliveMessageHandler = function(logger) {
  return {
    shouldHandleMessage: function({ message }) {
      return message === "2::";
    },
    handleMessage: function({ message, socket }) {
      logger.debug(`Handling keep alive`);

      socket.send({ topic: "2::" });
    }
  };
};

const CommandsMessageHandler = function(logger) {
  return {
    shouldHandleMessage: function({ message }) {
      return message.startsWith("5::/com.samsung.companion:");
    },
    handleMessage: function({ message, socket }) {
      const payload = JSON.parse(
        message.slice("5::/com.samsung.companion:".length)
      );

      logger.debug(`Handling message: ${message}`);

      const decrypted = JSON.parse(socket.encryption.decrypt(payload.args));
      logger.debug(`Decrypted message: ${JSON.stringify(decrypted)}`);

      if (
        payload.name === "receiveCommon" &&
        decrypted.plugin === "NNavi" &&
        decrypted.api === "GetDUID"
      ) {
        return { DUID: decrypted.result };
      }
    }
  };
};

module.exports = {
  CommandsMessageHandler,
  KeepAliveMessageHandler,
  InitialMessageHandler
};
