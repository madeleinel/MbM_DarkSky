// Set up Express
var express = require('express'),
    app = express(),
    proxy = require('express-http-proxy');
// Specify where to serve the files from on the site
// As there's only page (endpoint '/'), can set up using app.use() rather than app.get()
app.use(express.static('public'));



// Set up the port to run the site from; either the automatically provided one, or localhost 5500
var port = process.env.PORT || 5500;

// Specify where to serve the files from on the site (endpoint '/')
// app.get('/', function (request, response) {
//   response.sendFile(__dirname + '/public/index.html');
// });

// Start the Server
app.listen(port, function() {
  // Let the developer know which port the server is on
  console.log('Server is ready on port ' + port);
});
