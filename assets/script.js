let APIKey = ae11ba5de350e5ab9401e30d33257531;
let city;
let queryURL =
  "http://api.openweathermap.org/data/2.5/weather?q=" +
  city +
  "&appid=" +
  APIKey;

//   fetch
fetch(queryURL)
  .then(function (response) {
    return response.json;
  })
  .then(function (data) {});
