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

$(function () {
  $("#today-card").hide();
});

// assign local storage
// localStorage.setItem("userInputArray", JSON.stringify([]));
let userInputArray = [];

// onload show previous searched cities
if (localStorage.getItem("userInputArray") !== null) {
  userInputArray = JSON.parse(localStorage.getItem("userInputArray"));
  createSelectableList(userInputArray);
}

// getting html elements from html
let todayImg = $(".card-img-today");
let cardToday = $(".card-text-today");

// getting User input
$("#inputCity").change(function (event) {
  $("#inputCity").val(event.target.value);
});
$("form").submit(function (event) {
  event.preventDefault();
  city = $(inputCity).val();
  //save user searche for city into local storage

  if (localStorage.getItem("userInputArray") !== null) {
    userInputArray = JSON.parse(localStorage.getItem("userInputArray"));
    createSelectableList(userInputArray);
  } else {
    userInputArray.push(city.toUpperCase());
  }
  if (!userInputArray.includes(city.toUpperCase())) {
    userInputArray.push(city.toUpperCase());
  }
  localStorage.setItem("userInputArray", JSON.stringify(userInputArray));
  createSelectableList(userInputArray);

  getWeatherData();
});

// functions
function getWeatherData() {
  let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`;
  //   fetch
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      showWeatherData(data);
      getCoordinates();
    });
}

// functions
function showWeatherData(data) {
  $("#today-card").show();
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

function getCoordinates() {
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`
  )
    .then((res) => res.json())
    .then((data) => {
      let lat = data[0].lat;
      let lon = data[0].lon;

      get5dayForecast(lat, lon);
    });
}

function get5dayForecast(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`
  )
    .then((res) => res.json())
    .then((data) => {
      $("#forecast-container").html("");

      for (let i = 0; i < data.list.length; i += 8) {
        let day = data.list[i];
        let date = day.dt_txt.split(" ")[0];
        let icon = day.weather[0].icon;
        let temperature = day.main.temp.toFixed(0);
        let humidity = day.main.humidity;
        let wind = (day.wind.speed * 3.6).toFixed(2);

        let forcastCard = `
        <div class="col-12 col-md-6 col-lg-4 forecast-item-day">
        <div class="card my-2">
        <img src="https://openweathermap.org/img/w/${icon}.png" class="card-img-top" alt="icon represents weather" id="forecast-icon" />
        <div class="card-body">
          <div class="card-text">
            <div class="day">${date}</div>

            <div><p>Temperature: ${temperature} ℃</p></div>
            <div><p>Humidity: ${humidity} %</p></div>
            <div><p>Wind Speed: ${wind} Km/hr</p></div>
          </div>
        </div>
      </div>
      </div>`;
        $("#forecast-container").append(forcastCard);
      }
    });
}

// for selectable
function createSelectableList(userList) {
  console.log("hi");
  $("#selectable").html("");
  for (let i = 0; i < userList.length; i++) {
    $("#selectable").append(
      `<li class="ui-widget-content d-block" onclick="searchAgain(this)">${userList[i]}</li>`
    );
  }
}

// to make the city button search again
function searchAgain(element) {
  $("#inputCity").val($(element).text());
}
