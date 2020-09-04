const form = document.querySelector(".search form");
const input = document.querySelector(".search input");
const msg = document.querySelector(".search .msg");
const cities = document.querySelector(".results .cities");
const apiKey = "d9d1610fdb5a0a14f64e9add8173e17a";
let p = document.getElementsByTagName('p');
let city = document.querySelector('.city');
let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];
let information = document.querySelector('.information');

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

  //function to convert time from UNIX time to EPOCH time
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
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const { main, name, sys, coord, wind, clouds, weather } = data;
        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
          weather[0]["icon"]
          }.svg`;

        const li = document.createElement("li");
        li.classList.add("info");
        const markup = `
        <div class="more-info-temp">Feels Like: ${Math.round(main.feels_like)}<sup>°C</sup></div>
        <div class="more-info">Minimum temperature: ${Math.round(main.temp_min)}<sup>°C</sup></div>
        <div class="more-info">Maximum temperature : ${Math.round(main.temp_max)}<sup>°C</sup></div>
        <div class="more-info">Humidity: ${(main.humidity)}%</div>
        <div class="more-info">Wind Speed: ${(wind.speed)}m/s</div>
        <div class="more-info">Wind Direction: ${(wind.deg)}<sup>°</sup></div>
        <div class="more-info">Cloudiness: ${(clouds.all)}%</div>
        <div class="more-info">Atmospheric pressure : ${(main.pressure)}hPa</div>
        <div class="more-info">Longitude: ${coord.lon}</div>
        <div class="more-info">Latitude: ${coord.lat}</div>
        <div class="more-info">Sunrise: ${timeConverter(sys.sunrise)}am</div>
        <div class="more-info">Sunset: ${timeConverter(sys.sunset)}pm</div>
      `;
        li.innerHTML = markup;
        information.appendChild(li);

        const li1 = document.createElement("li");
        li1.classList.add("city");
        const markup1 = `
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
        li1.innerHTML = markup1;
        information.appendChild(li1);
      })
  }

  //delete weather result from site
  for (var i = 0; i < p.length; i++) { // loop over them
    p[i].addEventListener('click', function (e) {
      console.log(i);
      var city = document.querySelector('.city');
      modal.style.display = "block";
      openModal();
      //city.remove();
      //localStorage.removeItem(i);
    });
  }

  // When the user clicks on the weather box, open the modal
  if (city) {
    var city = document.querySelector('.city');
    for (let i = 0; i < city.length; i++) {
      city[i].addEventListener('click', function (e) {
        modal.style.display = "block";
        //openModal();
      })
    }
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
    information.innerHTML = '';
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      information.innerHTML = '';
    }
  }

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
      //
    }
  }

  //Loads the list of saved location.
  function loadLocationList() {
    for (var i = 0; i < localStorage.length; i++) {
      //console.log(localStorage.getItem(localStorage.key(i)));
      let key = localStorage.key(i);
      let weatherdata = JSON.parse(localStorage.getItem(key));
      const li = document.createElement("li");
      li.classList.add("city");
      li.innerHTML = weatherdata.split(",");   
      cities.appendChild(li);
    }
  }
  loadLocationList();

  msg.textContent = "";
  form.reset();
  input.focus();
});