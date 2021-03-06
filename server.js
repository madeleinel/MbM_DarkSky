// Set up Express
var express = require('express'), // access the express module
    app = express(), // create an express app
    request = require('request-promise'), // Use request-promise to enable the Dark Sky API calls
    // Import the config object within the config.js file to access the API keys:
    configFile = require('./config'),
    configObject = configFile.config,
    darkSky_key = configObject.DARKSKY_KEY,
    googleMaps_key = configObject.GOOGLEMAPS_KEY;

// Specify where to serve the static files from on the site
// As there's only page (endpoint '/'), can set up using app.use() rather than app.get()
app.use(express.static('public'));

// Use the Google Maps API to get the latitude and longitude of the user's current location
// Need to set up a secure connection (https) before this can be done

// Set variables for the GET request
var darksky_options = {
  method: 'GET',
  // As not yet able to get the user's current geolocation; the API call uri is using London coordinates
  uri: 'https://api.darksky.net/forecast/' + darkSky_key + "/51.5306270,-0.0381030" // path + api_key + "/" + latitude + "," + longitude
};

// exports.apiCall =
request(darksky_options)
  .then(function apiCall(response) {
    // return response;
    // Export the entire response to script.js, and move the data handling below to that file

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

        // make clothing recommendations based on the predicted lowest temperature of the day
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

        // make umbrella recommendations based on the predicted likelihood of rain during the day
        if (currentItem.precipProbability === 0) {
          console.log('You don\'t need to bring an umbrella today.')
        } else if (currentItem.precipProbability > 0.25 && currentItem.precipProbability < 0.75) {
          console.log('It might rain as well; you might want to bring an umbrella as well.')
        } else {
          console.log('It\'s going to rain as well, so you should bring an umbrella.')
        }

        // just for fun; recommend viewing the full moon if it's likely to be visible that night
        if (currentItem.moonPhase === 0.5 && currentItem.cloudCover < 0.25) {
          console.log('There will be a fullmoon tonight and the sky will be clear; you should go outside and watch it!')
        }

        // Also use currentItem.precipType currentItem.windSpeed for the recommendations?
      }
    }
  })
  .catch(function(err) {
    console.log(err); // In case of an error, console.log it
  });

// Set up the port to run the site from; either the automatically provided one, or localhost 5500
var port = process.env.PORT || 2200;

// Start the Server
app.listen(port, function() {
  // Let the developer know which port the server is on
  console.log('Server is ready on port ' + port);
});
