var currentDate = moment().format('LLLL');
var apiKey = "&appid=abc1802dc1a5156a171173164c7d4cc6";
var savedCity = JSON.parse(localStorage.getItem('savedCity')) || [];

//if enter is pressed by user trigger the on(click) function
$("#search-input").keypress(function (event) {

  if (event.keyCode === 13) {
    event.preventDefault();
    $("#searchBtn").click();
  }
});

//function to obtain latitude and logitude information
function uvQuery(lon, lat) {
  return "&lon=" + lon + "&lat=" + lat
}

//Start ajax calls
$("#searchBtn").click(function () {
  var qry = $("#search-input").val().trim();
  getData(qry);
  $("#search-input").attr("placeholder", "Please enter a city");

  savedCity.unshift(qry);

  localStorage.setItem("savedCity", JSON.stringify(savedCity))

  renderButons();
});

// to save data on the page 
function init() {
  var query = localStorage.getItem('city') || 'Tucson';
  getData(query);
  renderButons();
}

function getData(qry) {

  // run save search function that will push new inputs into savedCity array
  saveSearch(qry);

  // set date using moments.js 
  $(".date").text(currentDate);

  // create variables that will hold urls for ajax calls
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";
  var uvURL = "https://api.openweathermap.org/data/2.5/uvi?";
  var imperial = "&units=imperial";

  // call to update weather conditions
  $.ajax({
    url: queryURL + qry + apiKey + imperial,
    method: "GET"
  }).then(function (response) {

    $("#cityName").html(response.name);
    $("#temp").html(response.main.temp);
    $("#humid").html(response.main.humidity);
    $("#wind").html(response.wind.speed);

    // call to get the UV info
    $.ajax({
      url: uvURL + uvQuery(response.coord.lon, response.coord.lat) + apiKey,
      method: "GET"
    }).then(function (uvRes) {

      // UV Index for current day
      $("#uv").html(uvRes.value);
    });

    var iconPath = response.weather[0].icon;
    var iconURL = "https://openweathermap.org/img/wn/" + iconPath + "@2x.png";

    // Weather icon for current day
    var img1 = $("<img>");
    img1.attr("src", iconURL);
    $("#icon").html(img1);
  });

  var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=";

  // Get 5 Day forecast
  $.ajax({
    url: forecastURL + qry + apiKey + imperial,
    method: "GET"
  }).then(function (forResponse) {
    console.log(forResponse)
    // Update Forecast cards
    // Day 1
    var dateOne = moment().add(1, 'days').format('L');
    $("#day1").html(dateOne);

    var icon5dayPath1 = forResponse.list[4].weather[0].icon;
    var icon5dayURL1 = "https://openweathermap.org/img/wn/" + icon5dayPath1 + ".png";

    var iconDay1 = $("<img>");
    iconDay1.attr("src", icon5dayURL1);
    $("#icon1").html(iconDay1);

    $("#temp1").html(forResponse.list[4].main.temp);
    $("#humid1").html(forResponse.list[4].main.humidity);

    // Day 2
    var dateTwo = moment().add(2, 'days').format('L');
    $("#day2").html(dateTwo);

    var icon5dayPath2 = forResponse.list[12].weather[0].icon;
    var icon5dayURL2 = "https://openweathermap.org/img/wn/" + icon5dayPath2 + ".png";

    var iconDay2 = $("<img>");
    iconDay2.attr("src", icon5dayURL2);
    $("#icon2").html(iconDay2);

    $("#temp2").html(forResponse.list[12].main.temp);
    $("#humid2").html(forResponse.list[12].main.humidity);

    // Day 3
    var dateThree = moment().add(3, 'days').format('L');
    $("#day3").html(dateThree);

    var icon5dayPath3 = forResponse.list[20].weather[0].icon;
    var icon5dayURL3 = "https://openweathermap.org/img/wn/" + icon5dayPath3 + ".png";

    var iconDay3 = $("<img>");
    iconDay3.attr("src", icon5dayURL3);
    $("#icon3").html(iconDay3);

    $("#temp3").html(forResponse.list[20].main.temp);
    $("#humid3").html(forResponse.list[20].main.humidity);

    // Day 4
    var dateFour = moment().add(4, 'days').format('L');
    $("#day4").html(dateFour);

    var icon5dayPath4 = forResponse.list[28].weather[0].icon;
    var icon5dayURL4 = "https://openweathermap.org/img/wn/" + icon5dayPath4 + ".png";

    var iconDay4 = $("<img>");
    iconDay4.attr("src", icon5dayURL4);
    $("#icon4").html(iconDay4);

    $("#temp4").html(forResponse.list[28].main.temp);
    $("#humid4").html(forResponse.list[28].main.humidity);

    // Day 5
    var dateFive = moment().add(5, 'days').format('L');
    $("#day5").html(dateFive);

    var icon5dayPath5 = forResponse.list[36].weather[0].icon;
    var icon5dayURL5 = "https://openweathermap.org/img/wn/" + icon5dayPath5 + ".png";

    var iconDay5 = $("<img>");
    iconDay5.attr("src", icon5dayURL5);
    $("#icon5").html(iconDay5);

    $("#temp5").html(forResponse.list[36].main.temp);
    $("#humid5").html(forResponse.list[36].main.humidity);
  });
}

// function to create search history
function saveSearch(city) {

  localStorage.setItem('city', city);
}

// on click event for every new city button created run getData function in accordance with user's search
$("#city-list").on("click", ".searches", function () {
  var queryBtn = $(this).text();
  getData(queryBtn);
  saveSearch(queryBtn);
})

init();

function renderButons() {

  //clear the UL that will hold all ne <li> elements before appending
  $("#city-list").empty();
  for (i = 0; i < savedCity.length; i++) {
    newCity = $("<button></button>").append(savedCity[i]).addClass("btn btn-primary m-1 searches");
    $("#city-list").append(newCity);
    savedCity = savedCity.slice(0, 5);
  }

  //clear user's input area
  $("#search-input").val("");
}