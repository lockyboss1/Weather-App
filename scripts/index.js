const form = document.querySelector(".search form");
const input = document.querySelector(".search input");
const msg = document.querySelector(".search .msg");
const cities = document.querySelector(".results .cities");
const apiKey = "d9d1610fdb5a0a14f64e9add8173e17a";
let p = document.getElementsByTagName('p');
let city = document.querySelector('.city');
let locationData = document.getElementById('locationData');
let moreInfo = document.getElementById('moreInfo');
let h1 = document.querySelector('.h1');
let longitude;
let latitude;

//gets the current date and time
function getDate() {
  var today = new Date();
  time = timeConverter(today.getTime());
  h1.innerHTML += today;
}
getDate();

//function to convert time from UNIX time to EPOCH time
function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
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
  var months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = date + ' ' + month + ' ' + year;
  return time;
}

let current = document.querySelector('.current');
function initCoords() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(currentLocation);
  } else {
    //
  }
}
initCoords();

function currentLocation(position) {
  longitude = position.coords.longitude;
  latitude = position.coords.latitude;
  var latlon = position.coords.latitude + "," + position.coords.longitude;

  var img_url = "https://maps.googleapis.com/maps/api/staticmap?center="+latlon+"&zoom=14&size=360x300&sensor=false&key=AIzaSyALD9uk0vlUcepMIqgntkbcRDGjJVS8kS0";
  document.getElementById("mapHolder").innerHTML = "<img src='"+img_url+"'>";
  const currentLocationData = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  fetch(currentLocationData)
    .then(Response => Response.json())
    .then(data => {
      const { main, name, sys, weather } = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
        }.svg`;

      const li = document.createElement("li");
      const markup = `
          <h2 class="location-name" data-name = ${name},${sys.country}">
            <span>${name}</span>,
            <span>${sys.country}</span>
          </h2>
          <div class="location-temp">${Math.round(main.temp)}<sup>°C</sup></div>
          <figure>
            <img class="location-icon" src="${icon}" alt="${
        weather[0]["description"]
        }">
            <figcaption>${weather[0]["description"]}</figcaption>
          </figure>`;
      li.innerHTML = markup;
      locationData.appendChild(li);
    })

    fetch(currentLocationData)
    .then(Response => Response.json())
    .then(data => {
      const { main, sys, wind, clouds, } = data;

      const li = document.createElement("li");
      const markup = `
      <div class="feelsLike">Feels Like ${Math.round(main.feels_like)}<sup>°C</sup></div>
      <div class="humidity">Humidity: ${(main.humidity)}%</div>
      <div class="windSpeed">Wind Speed: ${(wind.speed)}m/s</div>
      <div class="windDirection">Wind Direction: ${(wind.deg)}<sup>°</sup></div>
      <div class="cloudiness">Cloudiness: ${(clouds.all)}%</div>
      <div class="pressure">Atmospheric pressure : ${(main.pressure)}hPa</div>
      <div class="sunrise">Sunrise: ${timeConverter(sys.sunrise)}am</div>
      <div class="sunset">Sunset: ${timeConverter(sys.sunset)}pm</div>
    `;
      li.innerHTML = markup;
      moreInfo.appendChild(li);
    })

}

form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  //check if there's already a city
  const listItems = cities.querySelectorAll(".results .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = "";
      if (inputVal.includes(",")) {

        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {

        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
        }...otherwise be more specific by providing the country code as well.`;
      form.reset();
      input.focus();
      return;
    }
  }

  //ajax here
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { main, name, sys, weather } = data;
      const icon = `https://openweathermap.org/img/wn/${
        weather[0]["icon"]
        }@2x.png`;

      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <div>
          <p class="close1">x</p>
        </div>
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
        weather[0]["description"]
        }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
      li.innerHTML = markup;
      saveLocationList(markup);
      cities.appendChild(li);
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city";
    });

  //delete weather result from site
  function removeWeatherResult() {
    for (var i = 0; i < p.length; i++) { // loop over them
      p[i].onclick = function () {
        console.log(i);
        var city = document.querySelector('.city');
        city.remove(i);
        localStorage.removeItem("list_items", key(i));
      };
    }
  }
  removeWeatherResult();

  //localstorage function
  function saveLocationList(add_item) {
    // parse existing storage key or string representation of empty array
    var existingEntries = JSON.parse(localStorage.getItem("list_items") || '[]');

    // Add item if it's not already in the array, then store array again
    if (!existingEntries.includes(add_item)) {
      existingEntries.push(add_item);
      localStorage.setItem("list_items", JSON.stringify(existingEntries));
    } else {
      // or tell user it's already there
      console.log(add_item + ' already exists')
    }
  }

  msg.textContent = "";
  form.reset();
  input.focus();

  if (!('caches' in window)) {
    return null;
  }

  return caches.match(url)
    .then((response) => {
      if (response) {
        return response.json();
      }
      return null;
    })
    .catch((err) => {
      console.error('Error getting data from cache', err);
      return null;
    });
});

//Loads the list of saved location.
window.onload = function () {
  for (var i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let weatherdata = JSON.parse(localStorage.getItem(key));
    if (weatherdata !== null) {
      weatherdata.forEach(function () {
        const li = document.createElement("li");
        li.classList.add("city");
        cities.innerHTML = "";
        li.innerHTML = weatherdata;
        li.style.display = 'grid';
        cities.appendChild(li);
      })
    } else { //if nothing exist in storage, keep array empty
      weatherdata = [];
    }
  }
}

