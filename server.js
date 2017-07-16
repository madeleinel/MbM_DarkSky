// Set up Express
var express = require('express'), // access the express module
    app = express(), // create an express app
    request = require('request-promise'),
    // Import the config object within the config.js file to access the API keys:
    configFile = require('./config'),
    configObject = configFile.config,
    darkSky_key = configObject.DARKSKY_KEY,
    googleMaps_key = configObject.GOOGLEMAPS_KEY;

// Specify where to serve the static files from on the site
// As there's only page (endpoint '/'), can set up using app.use() rather than app.get()
app.use(express.static('public'));

// Set variables for the GET request
var weather_options = {
  method: 'GET',
  uri: 'https://api.darksky.net/forecast/' + darkSky_key + "/51.5306270,-0.0381030" // path + api_key + "/" + latitude + "," + longitude
};

// exports.apiCall =
request(weather_options)
  .then(function apiCall(response) {
    // return response;

    // Convert the response into a JavaScript object, to access the relevant data within it
    var result = JSON.parse(response);
    var today = new Date(),
        // Get the full current date from the UNIX timestamp; to compare to the full date of the data points
        currentDate = today.toJSON().slice(0,10).replace(/-/g,'/'),
        loopLength = result.daily.data.length; // specify the loop "length" outside of the for loop, to avoid it being calculated each time it loop over

    for (i = 0; i < loopLength; i++) {
      // get the timestamp of each forecast, and extract the date from it; to compare to the current date below
      var currentItem = result.daily.data[i],
          unixTimestamp = currentItem.time,
          convertTimestamp = new Date(unixTimestamp*1000),
          extractDate = convertTimestamp.toJSON().slice(0,10).replace(/-/g,'/');

      if (extractDate === currentDate) { // if the timestamp matches the current date; retrieve and use the relevant data to make recommendations
        // convert temperature (Fahrenheit to Celsius)
        var minTemp = Math.round((currentItem.temperatureMin - 32) * 5/9);
        var maxTemp = Math.round((currentItem.temperatureMax - 32) * 5/9);

        if (minTemp < 0) {
          console.log('It will be freezing today, so wear a warm coat! ')
        } else if (minTemp < 10) {
          console.log('It will be cold today, so bring a jacket. ')
        } else if (minTemp < 20) {
          console.log('It will be mild today, so you should wear something with long sleeves. ')
        } else if (minTemp < 30) {
          console.log('It will be hot today, so wear shorts and a t-shirt. ')
        } else {
          console.log('It will be boiling today, so stay inside where there\'s air conditioning. ')
        }

        if (currentItem.precipProbability === 0) {
          console.log('You don\'t need to bring an umbrella today.')
        } else if (currentItem.precipProbability > 0.25 && currentItem.precipProbability < 0.75) {
          console.log('It might rain as well; you might want to bring an umbrella as well.')
        } else {
          console.log('It\'s going to rain as well, so you should bring an umbrella.')
        }

        if (currentItem.moonPhase === 0.5 && currentItem.cloudCover < 0.25) {
          console.log('There will be a fullmoon tonight and the sky will be clear; you should go outside and watch it!')
        }


        // console.log(currentItem.precipType);
        // console.log(currentItem.windSpeed);

        // create a paragraph for the output text
        // var outputField = document.getElementById('output');
        //     outputParagraph = document.createElement('p');
        // place the paragraph within the output element
        // outputField.appendChild(outputParagraph);
      }
    }
  })
  .catch(function(err) {
    console.log(err); // In case of an error, console.log it
  });

// Set up the port to run the site from; either the automatically provided one, or localhost 5500
var port = process.env.PORT || 5500;

// Start the Server
app.listen(port, function() {
  // Let the developer know which port the server is on
  console.log('Server is ready on port ' + port);
});
