// ----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------  TASK LIST  --------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------

// SEARCH HISTORY BUTTON SHOULD LOAD THE CITY THAT IS CLICKED ON IN THE SEARCH HISTORY MENU.....

// --------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------- GLOBAL VARIABLES -------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------

// selects the search-btn id from the button in the html
const searchBtn = document.getElementById('search-btn')

// selects the userInput id from html
// eslint-disable-next-line no-var
var userInput = document.getElementById('userInput')
console.log(userInput)
// console.log(userInput.innerHTML)

// set empty array to store local storage
// let searchHistory = [];
let searchHistory = JSON.parse(localStorage.getItem('searchHistory'))

if (searchHistory === null) {
  searchHistory = []
};

// --------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------- MODAL ----------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------

// Get the modal
const modal = document.getElementById('myModal')

// Get the button that opens the modal
// const btn = document.getElementById('myBtn')

// Get the <span> element that closes the modal
const span = document.getElementsByClassName('close')[0]

// When the user clicks on the button, open the modal

searchBtn.onclick = function () {
  if (userInput.value === '') {
    modal.style.display = 'block'
    document.getElementById('search-btn').disabled = true
    searchHistory.pop(userInput.value)
  } else {
    document.getElementById('search-btn').disabled = false
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = 'none'
    document.getElementById('search-btn').disabled = false
    searchHistory.pop(userInput.value)
    document.getElementById('btn').remove()
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = 'none'
      document.getElementById('search-btn').disabled = false
      searchHistory.pop(userInput.value)
      document.getElementById('btn').remove()
    }
  }
}

// --------------------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------- GET USER LOCATION -------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------

// adds an event listener to the window and starts a function on the load of the window
window.addEventListener('load', function () {
  // sets lon variable
  // let long;
  // set lat variable
  //   let lat;
  // conditional for if navigator.geolocation is true
  if (navigator.geolocation) {
    // sets a function to be run for navigator.geolocation.getCurrentPosition
    navigator.geolocation.getCurrentPosition(position => {
      // logs current position
      console.log(position)
    })
  }

  printLocalStorage()
})

// --------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------- SET LOCAL STORAGE -----------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------

function setLocalStorageItem () {
  // pushed userInput value to the searchHistory array
  searchHistory.push(userInput.value)

  // set searchHistory to localStorage
  window.localStorage.setItem('searchHistory', JSON.stringify(searchHistory))

  // log localStorage
  // console.log(searchHistory);
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------- PRINT LOCAL STORAGE TO MENU -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------

function printLocalStorage () {
  for (let index = 0; index < searchHistory.length; index++) {
    const li = document.createElement('li')
    li.setAttribute('class', 'btn')
    // create textnode for user input
    const t = document.createTextNode(searchHistory[index])
    // append the textnode to the li element
    li.appendChild(t)
    // append the li element to the element id search history
    document.getElementById('search-history').appendChild(li)
  };
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------- CREATE MENU ITEM FUNCTION ---------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------

function createMenuItem () {
  // create element "li"
  const shBtn = document.createElement('button')
  // create textnode for user input
  const t = document.createTextNode(userInput.value)
  // append the textnode to the li element
  shBtn.appendChild(t)
  shBtn.setAttribute('id', 'btn')
  shBtn.setAttribute('type', 'button')
  shBtn.setAttribute('style', 'padding: 10px;')
  console.log(shBtn)
  // append the li element to the element id search history
  document.getElementById('search-history').appendChild(shBtn)

  shBtn.addEventListener('click', function () {
    const shBtnInnerText = shBtn.innerText

    alert('shBtn was clicked')
    console.log(shBtn)
    console.log(shBtnInnerText)
    console.log(shBtn.innerHTML)
  })
};

// printLocalStorage()
// console.log(searchHistory)
// console.log(typeof searchHistory)

// ---------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------- ON SEARCH HISTORY CLICK -----------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------

function menuButtonClick () {
  // document.getElementById("btn").onclick = function(){
  const input = document.getElementsByTagName('li')

  input.onclick = function () {
    runAjaxQuery()

    alert('hksdflks')
  }
  // }
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------ ON SEARCH BUTTON CLICK ---------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------

searchBtn.addEventListener('click', function () {
  runAjaxQuery(userInput)
})

// ---------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------ RUN AJAX QUERY -----------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------

function runAjaxQuery () {
  // userInput = document.querySelector('userInput').value.trim()
  console.log(userInput.value)

  // sets the api url along with the apikey to the variable queryURL
  const queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + userInput.value.trim() + '&units=imperial&appid=b8e7f131d4a9ab46637431ee099c233a'
  console.log(queryURL)

  console.log(userInput)

  createMenuItem()

  menuButtonClick()

  setLocalStorageItem()

  // eslint-disable-next-line no-undef
  $.ajax({

    url: queryURL,

    type: 'GET'

  }).then(function (response) {
    const lon = response.city.coord.lon

    const lat = response.city.coord.lat

    const uvQueryURL = 'http://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=b8e7f131d4a9ab46637431ee099c233a'

    // eslint-disable-next-line no-undef
    $.ajax({

      url: uvQueryURL,

      type: 'GET'

    }).then(function (uvresponse) {
      // ----------------------------------------------------------------------------------------------------------------------------------------------------
      // -----------------------------------------------------------------------------------------------------------------  UV INDEX  --------------------------------------------------------
      // ----------------------------------------------------------------------------------------------------------------------------------------------------

      // console.log(uvresponse);

      document.getElementById('uv-index').textContent = 'UV Index: ' + uvresponse.value
      if (uvresponse.value >= 3 && uvresponse.value < 6) {
        document.getElementById('uv-index').classList.add('yellow')
      } else if (uvresponse.value >= 6 && uvresponse.value < 8) {
        document.getElementById('uv-index').classList.add('orange')
      } else if (uvresponse.value >= 8) {
        document.getElementById('uv-index').classList.add('red')
      } else {
        document.getElementById('uv-index').classList.add('green')
      }
    })

    // ----------------------------------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------  CURRENT WEATHER[1]  --------------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------------------------------------------------

    // logs the original returned object
    console.log(response)
    // sets the city name to the id city-name
    document.getElementById('city-name').textContent = 'City: ' + response.city.name
    // set date to variable
    const date = new Date()
    // set date to LocaleDateString
    date.toLocaleDateString()
    // response.list[0].dt_txt
    console.log(date)

    // sets the date to the id date
    document.getElementById('date').textContent = 'Date: ' + date

    // sets the weather icon to the id weather-icon
    document.getElementById('weather-icon').innerHTML = 'Weather Icon: ' + "<img src='http://openweathermap.org/img/wn/" + response.list[0].weather[0].icon + ".png'>"

    // sets the current temperature to the id current temperature
    document.getElementById('current-temperature').textContent = 'Temperature: ' + Math.floor(response.list[0].main.temp) + '°F'

    document.getElementById('current-humidity').textContent = 'Humidity: ' + response.list[0].main.humidity + '%'

    // sets the wind speed to the id wind-speed
    document.getElementById('wind-speed').textContent = 'Wind Speed: ' + response.list[0].wind.speed + 'mph'

    // ----------------------------------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------  FORECASTED WEATHER[2]  --------------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------------------------------------------------

    // sets the city name to the id city-name
    document.getElementById('city-name2').textContent = 'City: ' + response.city.name

    // sets the date to the id date
    document.getElementById('date2').textContent = 'Date: ' + response.list[4].dt_txt

    // sets the weather icon to the id weather-icon
    document.getElementById('weather-icon2').innerHTML = 'Weather Icon: ' + "<img src='http://openweathermap.org/img/wn/" + response.list[1].weather[0].icon + ".png'>"

    // sets the current temperature to the id current temperature
    document.getElementById('current-temperature2').textContent = 'Temperature: ' + Math.floor(response.list[1].main.temp) + '°F'

    document.getElementById('current-humidity2').textContent = 'Humidity: ' + response.list[1].main.humidity + '%'

    // sets the wind speed to the id wind-speed
    document.getElementById('wind-speed2').textContent = 'Wind Speed: ' + response.list[1].wind.speed + 'mph'

    // ----------------------------------------------------------------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------------  FORECASTED WEATHER[3]  ---------------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------------------------------------------------

    // sets the city name to the id city-name
    document.getElementById('city-name3').textContent = 'City: ' + response.city.name

    // sets the date to the id date
    document.getElementById('date3').textContent = 'Date: ' + response.list[12].dt_txt

    // sets the weather icon to the id weather-icon
    document.getElementById('weather-icon3').innerHTML = 'Weather Icon: ' + "<img src='http://openweathermap.org/img/wn/" + response.list[0].weather[0].icon + ".png'>"

    // sets the current temperature to the id current temperature
    document.getElementById('current-temperature3').textContent = 'Temperature: ' + Math.floor(response.list[2].main.temp) + '°F'

    document.getElementById('current-humidity3').textContent = 'Humidity: ' + response.list[2].main.humidity + '%'

    // sets the wind speed to the id wind-speed
    document.getElementById('wind-speed3').textContent = 'Wind Speed: ' + response.list[2].wind.speed + 'mph'

    // ----------------------------------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------  FORECASTED WEATHER[4]  --------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------------------------------------------------

    // sets the city name to the id city-name
    document.getElementById('city-name4').textContent = 'City: ' + response.city.name

    // sets the date to the id date
    document.getElementById('date4').textContent = 'Date: ' + response.list[20].dt_txt

    // sets the weather icon to the id weather-icon
    document.getElementById('weather-icon4').innerHTML = 'Weather Icon: ' + "<img src='http://openweathermap.org/img/wn/" + response.list[0].weather[0].icon + ".png'>"

    // sets the current temperature to the id current temperature
    document.getElementById('current-temperature4').textContent = 'Temperature: ' + Math.floor(response.list[3].main.temp) + '°F'

    document.getElementById('current-humidity4').textContent = 'Humidity: ' + response.list[3].main.humidity + '%'

    // sets the wind speed to the id wind-speed
    document.getElementById('wind-speed4').textContent = 'Wind Speed: ' + response.list[3].wind.speed + 'mph'

    // ----------------------------------------------------------------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------------------  FORECASTED WEATHER[5]  ---------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------------------------------------------------

    // sets the city name to the id city-name
    document.getElementById('city-name5').textContent = 'City: ' + response.city.name

    // sets the date to the id date
    document.getElementById('date5').textContent = 'Date: ' + response.list[28].dt_txt

    // sets the weather icon to the id weather-icon
    document.getElementById('weather-icon5').innerHTML = 'Weather Icon: ' + "<img src='http://openweathermap.org/img/wn/" + response.list[0].weather[0].icon + ".png'>"

    // sets the current temperature to the id current temperature
    document.getElementById('current-temperature5').textContent = 'Temperature: ' + Math.floor(response.list[4].main.temp) + '°F'

    document.getElementById('current-humidity5').textContent = 'Humidity: ' + response.list[4].main.humidity + '%'

    // sets the wind speed to the id wind-speed
    document.getElementById('wind-speed5').textContent = 'Wind Speed: ' + response.list[4].wind.speed + 'mph'

    // ----------------------------------------------------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------------------  FORECASTED WEATHER[6]  -----------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------------------------------------------------

    // sets the city name to the id city-name
    document.getElementById('city-name6').textContent = 'City: ' + response.city.name

    // sets the date to the id date
    document.getElementById('date6').textContent = 'Date: ' + response.list[36].dt_txt

    // sets the weather icon to the id weather-icon
    document.getElementById('weather-icon6').innerHTML = 'Weather Icon: ' + "<img src='http://openweathermap.org/img/wn/" + response.list[0].weather[0].icon + ".png'>"

    // sets the current temperature to the id current temperature
    document.getElementById('current-temperature6').textContent = 'Temperature: ' + Math.floor(response.list[5].main.temp) + '°F'

    document.getElementById('current-humidity6').textContent = 'Humidity: ' + response.list[5].main.humidity + '%'

    // sets the wind speed to the id wind-speed
    document.getElementById('wind-speed6').textContent = 'Wind Speed: ' + response.list[5].wind.speed + 'mph'
  })

  // runAjaxQuery()
  // this alert helps to see if the function was working
  // console.log(alert("button clicked"));
}
