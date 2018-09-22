function HandshakeRequest() {
  return {
    url: '/socket.io/1',
  };
}

function StartServiceRequest() {
  return {
    url: '/common/1.0.0/service/startService?appID=com.samsung.companion',
  };
}

module.exports = {
  HandshakeRequest,
  StartServiceRequest,
};
