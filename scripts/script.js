
        // -----------------------------------------------------------------------------
        // --------------------------------GET USER LOCATION----------------------------

        // adds an event listener to the window and starts a function on the load of the window
        window.addEventListener("load", () => {
            // sets lon variable
            let long;
            // set lat variable
            let lat;
            // conditional for if navigator.geolocation is true
            if (navigator.geolocation) {
                // sets a function to be run for navigator.geolocation.getCurrentPosition
                navigator.geolocation.getCurrentPosition(position => {
                    // logs current position
                    console.log(position);

                });

            };

        });

        // -----------------------------------------------------------------------------
        // ------------------------------GLOBAL VARIABLES-------------------------------

        // selects the search-btn id from the button in the html
        let searchBtn = $("#search-btn");
        // selects the userInput id from html
        let userInput = $("#userInput");

        // ------------------------------------------------------------------------------
        // ------------------------------USER INPUT/ SEARCH BUTTON-----------------------

        searchBtn.on("click", function () {
            // sets the api url along with the apikey to the variable queryURL
            let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + userInput.val().trim() + "&units=imperial&appid=b8e7f131d4a9ab46637431ee099c233a"
            // let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput.val().trim() + ",us&appid=b8e7f131d4a9ab46637431ee099c233a";

            $.ajax({

                url: queryURL,

                type: "GET"

            }).then(function (response) {
                let lon = response.city.coord["lon"];
                let lat = response.city.coord["lat"];

                // console.log(lon)
                // console.log(lat)


                let uvQueryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=b8e7f131d4a9ab46637431ee099c233a";

                $.ajax({

                    url: uvQueryURL,

                    type: "GET"

                }).then(function (uvresponse) {

                    // console.log(uvresponse);

                    document.getElementById('uv-index').textContent = uvresponse["value"];

                })


                // logs the original returned object
                console.log(response);
                // stores the city name in a variable
                // var city = response.city;
                // logs city name to the console
                // console.log(response.city.name);
                // sets the city name to the id city-name
                document.getElementById("city-name").textContent = response.city.name;
                // logs the date to the console
                // console.log(response.list[0].dt_txt)
                // sets the date to the id date
                document.getElementById("date").textContent = response.list[0].dt_txt;
                // logs the icon to the console
                // console.log(response.list[0].weather[0].icon)
                // sets the weather icon to the id weather-icon

                "http://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png";
                document.getElementById("weather-icon").textContent = "http://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png"
                
                "<img src='http://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png'>"
                // logs the current temperature to the console
                // console.log(response.list[0].main["temp"]);
                // sets the current temperature to the id current temperature
                document.getElementById("current-temperature").textContent = response.list[0].main["temp"];
                // logs the wind speed to the console
                // console.log(response.list[0].wind["speed"]);
                // sets the wind speed to the id wind-speed
                document.getElementById("wind-speed").textContent = response.list[0].wind["speed"];




            });

            // this alert helps to see if the function was working
            // console.log(alert("button clicked"));

        })