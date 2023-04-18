// to get date from day.js
let today = dayjs().format("ddd  MMM/DD/YYYY");
let now = dayjs().format("h:mm a");
let time = $("#time");
let showDate = $("<h4>").text(today);
let showTime = $("<h5>").text(now);
$(time).append(showDate);
$(time).append(showTime);
// to get the city from openweather
let APIKey = "ae11ba5de350e5ab9401e30d33257531";
let city;

// getting html elements from html
let todayImg = $(".card-img-today");
let cardToday = $(".card-text-today");

// getting User input
$("#inputCity").change(function (event) {
  $("#inputCity").val(event.target.value);
  //   $(inputCity).text(inputCity.val());
  console.log("inputCity :>> ", $("#inputCity").val());
});
$("form").submit(function (event) {
  event.preventDefault();
  city = $(inputCity).val();

  getWeatherData();
});

// functions
function getWeatherData() {
  let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`;
  console.log("queryURL :>> ", queryURL);
  //   fetch
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      showWeatherData(data);
    });
}

// functions
function showWeatherData(data) {
  $(cardToday).html("");
  $(cardToday).append(
    "<h4 style='text-transform:uppercase'>" + $(inputCity).val() + "</h4>"
  );

  // for the weather icon
  let iconCode = data.weather[0].icon;
  let iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
  $(todayImg).attr("src", iconURL);

  // for temperature
  let tempToday = $("<h5>");
  $(tempToday).text("Temperature: " + data.main.temp.toFixed(0) + " ℃");
  $(cardToday).append(tempToday);
  // for humidity
  let humToday = $("<h5>");
  $(humToday).text("Humidity: " + data.main.humidity + "%");
  $(cardToday).append(humToday);
  // for wind speed
  let windToday = $("<h5>");
  $(windToday).text(
    "Wind Speed: " + (data.wind.speed * 3.6).toFixed(2) + " Km/hr"
  );
  $(cardToday).append(windToday);
}
