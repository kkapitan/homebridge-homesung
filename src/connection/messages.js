function PushMessage({ plugin }) {
  return {
    name: 'registerPush',
    payload: {
      eventType: 'EMP',
      plugin,
    },
  };
}

function GetDUIDMessage() {
  return {
    name: 'callCommon',
    payload: {
      method: 'POST',
      body: {
        plugin: 'NNavi',
        api: 'GetDUID',
        version: '1.000',
      },
    },
  };
}

function SendKeyMessage({ key, duid }) {
  return {
    name: 'callCommon',
    payload: {
      method: 'POST',
      body: {
        plugin: 'RemoteControl',
        version: '1.000',
        api: 'SendRemoteKey',
        param1: duid,
        param2: 'Click',
        param3: key,
        param4: 'false',
      },
    },
  };
}

module.exports = { SendKeyMessage, GetDUIDMessage, PushMessage };
