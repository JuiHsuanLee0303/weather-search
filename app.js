// make require & import works in the same time
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// import api key
import { config } from "./config.js";
const weatherKey = config.weatherKey;

const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");

// change degree
function KtoC(kTemp) {
  return Math.round((kTemp - 272.12) * 10) / 10;
}

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/", (req, res) => {
  let { city } = req.body;
  console.log(city);
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKey}`;

  https
    .get(url, (response) => {
      console.log("statusCode:", response.statusCode);
      console.log("headers:", response.headers);

      response.on("data", (d) => {
        let djs = JSON.parse(d);
        let { temp } = djs.main ?? { temp: [] };
        let cTemp = KtoC(temp);
        res.render("weather.ejs", { djs, cTemp });
        console.log(djs);
      });
    })
    .on("error", (e) => {
      console.log(e);
    });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
