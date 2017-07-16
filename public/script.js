// use window.onLoad

function apiCall() {
  var xmlReq = new XMLHttpRequest();
  xmlReq.open("GET", "https://api.darksky.net/forecast/63e95c5f3b83ca14b52b4fb78ff46436/51.5306270,-0.0381030", true);
  xmlReq.send(null);

  console.log(xmlReq.status);
}

apiCall();
