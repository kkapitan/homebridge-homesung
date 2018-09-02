const HandshakeRequest = function() {
  return {
    url: "/socket.io/1"
  };
};

const StartServiceRequest = function() {
  return {
    url: "/common/1.0.0/service/startService?appID=com.samsung.companion"
  };
};

module.exports = {
  HandshakeRequest,
  StartServiceRequest
};
