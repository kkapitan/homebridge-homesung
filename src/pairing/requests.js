function StartPairingRequest({ config }) {
  return {
    url: `/ws/pairing?step=0&app_id=${config.appId}&device_id=${config.deviceId}&type=1`,
  };
}

function SendServerHelloRequest({ config, serverHello }) {
  return {
    url: `/ws/pairing?step=1&app_id=${config.appId}&device_id=${config.deviceId}`,
    method: 'POST',
    body: JSON.stringify({
      auth_Data: {
        auth_type: 'SPC',
        GeneratorServerHello: serverHello,
      },
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

function SendServerAckRequest({ config, requestId, serverAck }) {
  return {
    url: `/ws/pairing?step=2&app_id=${config.appId}&device_id=${config.deviceId}`,
    method: 'POST',
    body: JSON.stringify({
      auth_Data: {
        auth_type: 'SPC',
        request_id: requestId,
        ServerAckMsg: serverAck,
      },
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

function PinRequest() {
  return {
    url: '/ws/apps/CloudPINPage',
    method: 'POST',
  };
}

function HidePinRequest() {
  return {
    url: '/ws/apps/CloudPINPage/run',
    method: 'DELETE',
  };
}

module.exports = {
  PinRequest,
  HidePinRequest,
  StartPairingRequest,
  SendServerAckRequest,
  SendServerHelloRequest,
};
