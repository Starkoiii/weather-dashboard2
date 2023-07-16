// variable assignments
$(document).ready(function () {
    var key = '0a7ab6c913ff7fe0bef1db0b83580364'
    var localStorageCurrent = localStorage.getItem('pastCitys');
    var localCity = [];
    var localP = JSON.parse(localStorage.getItem('pastCitys'));
    var currentD = document.querySelector(".current");
    // this function gets the data you searched
    function fetchData(choice) {
        var url = "https://api.openweathermap.org/geo/1.0/direct?q=" + choice + "&limit=1&appid=" + key;
        fetch(url, {
            cache: 'reload',
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            //puts the location into the weather apis 
            var weatherURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + data[0].lat + '&lon=' + data[0].lon + '&units=imperial&appid=' + key;
            var currentWeather = 'https://api.openweathermap.org/data/2.5/weather?lat=' + data[0].lat + '&lon=' + data[0].lon + '&units=imperial&appid=' + key;
            fetch(weatherURL).then(function (response) {
                return response.json();
            }).then(function (data) {
                $('.5dayFork').each(function (i) {
                    $(this).find('.date').text(data.list[i * 8 + 4].dt_txt.split(' ')[0]);
                    $(this).find('.condition').attr('src', '#');
                    $(this).find('.temp').text('Temperature: ' + data.list[i * 8 + 4].main.temp + 'F');
                    $(this).find('.wind').text('Wind speed: ' + data.list[i * 8 + 4].wind.speed + 'mph');
                    $(this).find('.humid').text('Humidity: ' + data.list[i * 8 + 4].main.humidity + '%');
                });
            });
            fetch(currentWeather).then(function (response) {
                return response.json();
            }).then(function (data) {
                console.log(data)
                $(currentD).each(function (i) {
                    $(this).find('.date').text(data.name + ' (' + dayjs().format('MM/DD/YYYY') +  ')');
                    $(this).find('.condition').attr('src', '#');
                    $(this).find('.temp').text('Temperature: ' + data.main.temp + ', Feels like: ' + data.main.feels_like);
                    $(this).find('.wind').text('Wind speed: ' + data.wind.speed);
                    $(this).find('.humid').text('Humidity: ' + + data.main.humidity);
                });
            });
        });
    };
    //created a h2 to display the history data on the site
    function showHistory() {
        if (localStorageCurrent) {
            localP.forEach(function (i) {
                var h2 = document.createElement('h2');
                h2.innerText = i;
                $('#history').append(h2);
            });
        };
    };
    showHistory();
    //when the button is clicked,iy saves the input, erases the text box, and stores it in local storage
    $('button').on('click', function (event) {
        event.preventDefault();
        var input = $('#username').val().replaceAll(" ", "")
        $('#username').val('');
        if (input) {
            if (localStorageCurrent && !localP.includes(input)) {
                localP.push(input)
                localStorage.setItem('pastCities', JSON.stringify(localP))
            } else if (!localCity.includes(input)) {
                localCity.push(input)
                localStorage.setItem('pastCities', JSON.stringify(localCity))
            };
        };
        $('#history').val('');
        fetchData(input);
    });
    // click a city in the history to go back to the city you've already searched
    $('h2').on('click', function () {
        var choice = $(this).text()
        fetchData(choice)
    })
});