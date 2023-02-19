const { response } = require("express");
const request = require("request");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { dirname } = require("path");
const app = express();

let city = "jammu and kashmir";
const apikey = "60940ff09b57413ca2debf09de38cc09";
const units = "metric";
let temper;
let myPromise;
let descrip;


app.use(bodyParser.urlencoded({ extended: true }));
 app.use(express.static(__dirname))

app
  .get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  })
  .on("error", (err) => {
    console.log("Error: " + err.message);
  });

app.post("/", (req, res) => {
  city = req.body.cityName;
  let url =
  "https://api.openweathermap.org/data/2.5/weather?q=" +
  city +
  "&appid=" +
  apikey +
  "&units=" +
  units;
  https.get(url, (resp) => {
    console.log("inside https");

    resp.on("data", (data) => {
      let weatherData = JSON.parse(data);
      if (weatherData.cod === 200) {
        descrip = weatherData.weather[0].description;
        let humidity = weatherData.main.humidity;
        let icon = weatherData.weather[0].icon;
        let imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        res.write(
          "<h1>Current temperature in " +
            city +
            " is " +
            weatherData.main.temp +
            "&#8451</h1>"
        );
        res.write("<h2>Description: " + descrip + "</h2> ");
        res.write("<h3>Humidity: " + humidity + "%</h3>");
        res.write("<img src=" + imageURL + ">");
      } else res.write("<h1>City not found</h1>");
    });
  });
});








app.listen(3000, () => {
	console.log("Server started at 3000");
  });