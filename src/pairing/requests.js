const StartPairingRequest = function({ config }) {
  return {
    url: "/ws/pairing",
    qs: {
      step: 0,
      app_id: config.appId,
      device_id: config.deviceId,
      type: 1
    }
  };
};

const SendServerHelloRequest = function({ config, serverHello }) {
  return {
    url: "/ws/pairing",
    qs: {
      step: 1,
      app_id: config.appId,
      device_id: config.deviceId
    },
    method: "POST",
    body: JSON.stringify({
      auth_Data: {
        auth_type: "SPC",
        GeneratorServerHello: serverHello
      }
    }),
    headers: {
      "Content-Type": "application/json"
    }
  };
};

const SendServerAckRequest = function({ config, requestId, serverAck }) {
  return {
    url: "/ws/pairing",
    qs: {
      step: 2,
      app_id: config.appId,
      device_id: config.deviceId
    },
    method: "POST",
    body: JSON.stringify({
      auth_Data: {
        auth_type: "SPC",
        request_id: requestId,
        ServerAckMsg: serverAck
      }
    }),
    headers: {
      "Content-Type": "application/json"
    }
  };
};

const PinRequest = function() {
  return {
    url: "/ws/apps/CloudPINPage",
    method: "POST"
  };
};

const HidePinRequest = function() {
  return {
    url: "/ws/apps/CloudPINPage/run",
    method: "DELETE"
  };
};

module.exports = {
  PinRequest,
  HidePinRequest,
  StartPairingRequest,
  SendServerAckRequest,
  SendServerHelloRequest
};
