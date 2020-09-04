"use strict";

var form = document.querySelector(".search form");
var input = document.querySelector(".search input");
var msg = document.querySelector(".search .msg");
var cities = document.querySelector(".results .cities");
var apiKey = "d9d1610fdb5a0a14f64e9add8173e17a";
var p = document.getElementsByTagName('p');
var city = document.querySelector('.city');
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var information = document.querySelector('.information');
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
    cities.appendChild(li);
  })["catch"](function () {
    msg.textContent = "Please search for a valid city";
  }); //function to convert time from UNIX time to EPOCH time

  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
  }

  function openModal() {
    fetch(url).then(function (response) {
      return response.json();
    }).then(function (data) {
      var main = data.main,
          name = data.name,
          sys = data.sys,
          coord = data.coord,
          wind = data.wind,
          clouds = data.clouds,
          weather = data.weather,
          rain = data.rain;
      var icon = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/".concat(weather[0]["icon"], ".svg");
      var li = document.createElement("li");
      li.classList.add("info");
      var markup = "\n        <div class=\"more-info-temp\">Feels Like: ".concat(Math.round(main.feels_like), "<sup>\xB0C</sup></div>\n        <div class=\"more-info\">Minimum temperature: ").concat(Math.round(main.temp_min), "<sup>\xB0C</sup></div>\n        <div class=\"more-info\">Maximum temperature : ").concat(Math.round(main.temp_max), "<sup>\xB0C</sup></div>\n        <div class=\"more-info\">Humidity: ").concat(main.humidity, "%</div>\n        <div class=\"more-info\">Wind Speed: ").concat(wind.speed, "m/s</div>\n        <div class=\"more-info\">Wind Direction: ").concat(wind.deg, "<sup>\xB0</sup></div>\n        <div class=\"more-info\">Cloudiness: ").concat(clouds.all, "%</div>\n        <div class=\"more-info\">Atmospheric pressure : ").concat(main.pressure, "hPa</div>\n        <div class=\"more-info\">Longitude: ").concat(coord.lon, "</div>\n        <div class=\"more-info\">Latitude: ").concat(coord.lat, "</div>\n        <div class=\"more-info\">Sunrise: ").concat(timeConverter(sys.sunrise), "am</div>\n        <div class=\"more-info\">Sunset: ").concat(timeConverter(sys.sunset), "pm</div>\n      ");
      li.innerHTML = markup;
      information.appendChild(li);
      var li1 = document.createElement("li");
      li1.classList.add("city");
      var markup1 = "\n        <h2 class=\"city-name\" data-name=\"".concat(name, ",").concat(sys.country, "\">\n          <span>").concat(name, "</span>\n          <sup>").concat(sys.country, "</sup>\n        </h2>\n        <div class=\"city-temp\">").concat(Math.round(main.temp), "<sup>\xB0C</sup></div>\n        <figure>\n          <img class=\"city-icon\" src=\"").concat(icon, "\" alt=\"").concat(weather[0]["description"], "\">\n          <figcaption>").concat(weather[0]["description"], "</figcaption>\n        </figure>\n      ");
      li1.innerHTML = markup1;
      information.appendChild(li1);
    });
  } //delete weather result from site


  for (var i = 0; i < p.length; i++) {
    // loop over them
    p[i].addEventListener('click', function (e) {
      console.log(i);
      var city = document.querySelector('.city');
      modal.style.display = "block";
      openModal(); //city.remove();
    });
  } // When the user clicks on the weather box, open the modal


  if (city) {
    var city = document.querySelector('.city');

    for (var _i = 0; _i < city.length; _i++) {
      city[_i].addEventListener('click', function (e) {
        modal.style.display = "block"; //openModal();
      });
    }
  } // When the user clicks on <span> (x), close the modal


  span.onclick = function () {
    modal.style.display = "none";
    information.innerHTML = '';
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      information.innerHTML = '';
    }
  };

  msg.textContent = "";
  form.reset();
  input.focus();
});