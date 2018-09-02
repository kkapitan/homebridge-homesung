const { PushMessage, GetDUIDMessage } = require("./messages");

const InitialMessageHandler = function() {
  return {
    shouldHandleMessage: function({ message }) {
      return message === "1::";
    },
    handleMessage: function({ message, socket }) {
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

const KeepAliveMessageHandler = function() {
  return {
    shouldHandleMessage: function({ message }) {
      return message === "2::";
    },
    handleMessage: function({ message, socket }) {
      socket.send({ topic: "2::" });
    }
  };
};

const CommandsMessageHandler = function() {
  return {
    shouldHandleMessage: function({ message }) {
      return message.startsWith("5::/com.samsung.companion:");
    },
    handleMessage: function({ message, socket }) {
      const payload = JSON.parse(
        message.slice("5::/com.samsung.companion:".length)
      );
      if (payload.name !== "receiveCommon") {
        return;
      }

      const decrypted = JSON.parse(socket.encryption.decrypt(payload.args));
      if (decrypted.plugin === "NNavi" && decrypted.api === "GetDUID") {
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
