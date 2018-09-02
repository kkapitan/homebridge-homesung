const PushMessage = function({ plugin }) {
  return {
    name: "registerPush",
    payload: {
      eventType: "EMP",
      plugin: plugin
    }
  };
};

const GetDUIDMessage = function() {
  return {
    name: "callCommon",
    payload: {
      method: "POST",
      body: {
        plugin: "NNavi",
        api: "GetDUID",
        version: "1.000"
      }
    }
  };
};

const SendKeyMessage = function({ key, duid }) {
  return {
    name: "callCommon",
    payload: {
      method: "POST",
      body: {
        plugin: "RemoteControl",
        version: "1.000",
        api: "SendRemoteKey",
        param1: duid,
        param2: "Click",
        param3: key,
        param4: "false"
      }
    }
  };
};

module.exports = { SendKeyMessage, GetDUIDMessage, PushMessage };
