"use strict";

var form = document.querySelector(".search form");
var input = document.querySelector(".search input");
var msg = document.querySelector(".search .msg");
var cities = document.querySelector(".results .cities");
var apiKey = "d9d1610fdb5a0a14f64e9add8173e17a";
var p = document.getElementsByTagName('p');
var city = document.querySelector('.city');
var locationData = document.getElementById('locationData');
var moreInfo = document.getElementById('moreInfo');
var h1 = document.querySelector('.h1');
var longitude;
var latitude;
var windDirection = document.querySelector('.windDirection'); //gets the current date and time

function getDate() {
  var today = new Date();
  time = timeConverter(today.getTime());
  h1.innerHTML += today;
}

getDate();

function getWindDirection(number) {
  if (number > 348.75 && number < 11.25) {
    windDirection.innerHTML += "N";
  } else if (number > 11.25 && number < 33.75) {
    windDirection.innerHTML += "NNE";
  } else if (number > 33.75 && number < 56.25) {
    windDirection.innerHTML += "NE";
  } else if (number > 56.25 && number < 78.75) {
    windDirection.innerHTML += "ENE";
  } else if (number > 78.75 && number < 101.25) {
    windDirection.innerHTML += "E";
  } else if (number > 101.25 && number < 123.75) {
    windDirection.innerHTML += "ESE";
  } else if (number > 123.75 && number < 146.25) {
    windDirection.innerHTML += "SE";
  } else if (number > 146.25 && number < 168.75) {
    windDirection.innerHTML += "SSE";
  } else if (number > 168.75 && number < 191.25) {
    windDirection.innerHTML += "S";
  } else if (number > 191.25 && number < 213.75) {
    windDirection.innerHTML += "SSW";
  } else if (number > 213.75 && number < 236.25) {
    windDirection.innerHTML += "SW";
  } else if (number > 236.25 && number < 258.75) {
    windDirection.innerHTML += "WSW";
  } else if (number > 258.75 && number < 281.25) {
    windDirection.innerHTML += "W";
  } else if (number > 281.25 && number < 303.75) {
    windDirection.innerHTML += "WNW";
  } else if (number > 303.75 && number < 326.25) {
    windDirection.innerHTML += "NW";
  } else if (number > 326.25 && number < 348.75) {
    windDirection.innerHTML += "NNW";
  }
} //function to convert time from UNIX time to EPOCH time


function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  return time;
}

function timeConverter1(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = date + ' ' + month + ' ' + year;
  return time;
}

var current = document.querySelector('.current');

function initCoords() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(currentLocation);
  } else {//.innerHTML = "";
  }
}

initCoords();

function currentLocation(position) {
  longitude = position.coords.longitude;
  latitude = position.coords.latitude;
  var currentLocationData = "https://api.openweathermap.org/data/2.5/weather?lat=".concat(latitude, "&lon=").concat(longitude, "&appid=").concat(apiKey, "&units=metric");
  fetch(currentLocationData).then(function (Response) {
    return Response.json();
  }).then(function (data) {
    var main = data.main,
        name = data.name,
        sys = data.sys,
        weather = data.weather;
    var icon = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/".concat(weather[0]["icon"], ".svg");
    var li = document.createElement("li");
    var markup = "\n          <h2 class=\"location-name\" data-name = ".concat(name, ",").concat(sys.country, "\">\n            <span>").concat(name, "</span>,\n            <span>").concat(sys.country, "</span>\n          </h2>\n          <div class=\"location-temp\">").concat(Math.round(main.temp), "<sup>\xB0C</sup></div>\n          <figure>\n            <img class=\"location-icon\" src=\"").concat(icon, "\" alt=\"").concat(weather[0]["description"], "\">\n            <figcaption>").concat(weather[0]["description"], "</figcaption>\n          </figure>");
    li.innerHTML = markup;
    locationData.appendChild(li);
  });
  fetch(currentLocationData).then(function (Response) {
    return Response.json();
  }).then(function (data) {
    var main = data.main,
        sys = data.sys,
        wind = data.wind,
        clouds = data.clouds;
    var li = document.createElement("li");
    var markup = "\n      <div class=\"feelsLike\">Feels Like ".concat(Math.round(main.feels_like), "<sup>\xB0C</sup></div>\n      <div class=\"humidity\">Humidity: ").concat(main.humidity, "%</div>\n      <div class=\"windSpeed\">Wind Speed: ").concat(wind.speed, "m/s</div>\n      <div class=\"windDirection\">Wind Direction: ").concat(getWindDirection(wind.deg), "<sup>\xB0</sup></div>\n      <div class=\"cloudiness\">Cloudiness: ").concat(clouds.all, "%</div>\n      <div class=\"pressure\">Atmospheric pressure : ").concat(main.pressure, "hPa</div>\n      <div class=\"sunrise\">Sunrise: ").concat(timeConverter(sys.sunrise), "am</div>\n      <div class=\"sunset\">Sunset: ").concat(timeConverter(sys.sunset), "pm</div>\n    ");
    li.innerHTML = markup;
    moreInfo.appendChild(li);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  var inputVal = input.value; //check if there's already a city

  var listItems = cities.querySelectorAll(".results .city");
  var listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    var filteredArray = listItemsArray.filter(function (el) {
      var content = "";

      if (inputVal.includes(",")) {
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el.querySelector(".city-name span").textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }

      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = "You already know the weather for ".concat(filteredArray[0].querySelector(".city-name span").textContent, "...otherwise be more specific by providing the country code as well.");
      form.reset();
      input.focus();
      return;
    }
  } //ajax here


  var url = "https://api.openweathermap.org/data/2.5/weather?q=".concat(inputVal, "&appid=").concat(apiKey, "&units=metric");
  fetch(url).then(function (response) {
    return response.json();
  }).then(function (data) {
    var main = data.main,
        name = data.name,
        sys = data.sys,
        weather = data.weather;
    var icon = "https://openweathermap.org/img/wn/".concat(weather[0]["icon"], "@2x.png");
    var li = document.createElement("li");
    li.classList.add("city");
    var markup = "\n        <div>\n          <p class=\"close1\">x</p>\n        </div>\n        <h2 class=\"city-name\" data-name=\"".concat(name, ",").concat(sys.country, "\">\n          <span>").concat(name, "</span>\n          <sup>").concat(sys.country, "</sup>\n        </h2>\n        <div class=\"city-temp\">").concat(Math.round(main.temp), "<sup>\xB0C</sup></div>\n        <figure>\n          <img class=\"city-icon\" src=\"").concat(icon, "\" alt=\"").concat(weather[0]["description"], "\">\n          <figcaption>").concat(weather[0]["description"], "</figcaption>\n        </figure>\n      ");
    li.innerHTML = markup;
    saveLocationList(markup);
    cities.appendChild(li);
  })["catch"](function () {
    msg.textContent = "Please search for a valid city";
  }); //delete weather result from site

  function removeWeatherResult() {
    for (var i = 0; i < p.length; i++) {
      // loop over them
      p[i].addEventListener('click', function (e) {
        console.log(i); //var city = document.querySelector('.city');

        city.remove(); //localStorage.removeItem(i);
      });
    }
  }

  removeWeatherResult(); //localstorage function

  function saveLocationList(add_item) {
    // parse existing storage key or string representation of empty array
    var existingEntries = JSON.parse(localStorage.getItem("list_items") || '[]'); // Add item if it's not already in the array, then store array again

    if (!existingEntries.includes(add_item)) {
      existingEntries.push(add_item);
      localStorage.setItem("list_items", JSON.stringify(existingEntries));
    } else {
      // or tell user it's already there
      console.log(add_item + ' already exists');
    }
  }

  msg.textContent = "";
  form.reset();
  input.focus();

  if (!('caches' in window)) {
    return null;
  }

  return caches.match(url).then(function (response) {
    if (response) {
      return response.json();
    }

    return null;
  })["catch"](function (err) {
    console.error('Error getting data from cache', err);
    return null;
  });
}); //Loads the list of saved location.

window.onload = function () {
  var _loop = function _loop() {
    var key = localStorage.key(i);
    var weatherdata = JSON.parse(localStorage.getItem(key));

    if (weatherdata !== null) {
      weatherdata.forEach(function () {
        var li = document.createElement("li");
        li.classList.add("city");
        cities.innerHTML = "";
        li.innerHTML = weatherdata;
        li.style.display = 'grid';
        cities.appendChild(li); //removeWeatherResult();
      });
    } else {
      //if nothing exist in storage, keep array empty
      weatherdata = [];
    }
  };

  for (var i = 0; i < localStorage.length; i++) {
    _loop();
  }
};