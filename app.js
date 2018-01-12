var express = require("express");
var app = express();
var request = require("request");

app.use(express.static("public"));
app.set("view engine", "ejs");

//Main page
app.get("/", function(req, res){
    res.redirect("/competitions");
});

app.get("/competitions", function(req, res){
    res.render("main"); 
});

//Load page based on country chosen
app.get("/competitions/:country", function(req, res){
    var countryID = {
        england: "445",
        efl: "446",
        spain: "455",
        italy: "456",
        germany: "452",
        france: "450",
        portugal: "457",
        netherlands: "449",
        brazil: "444"
    };
    var country = req.params.country;
    var getTable = {
        url: "http://api.football-data.org/v1/competitions/" + countryID[country] + "/leagueTable",
        headers: {
        "X-Auth-Token": "a33900e1d9ff4b669c0be3bce52de7ec"
        }
    };
    var getFixtures = { 
        url: "http://api.football-data.org/v1/competitions/" + countryID[country] + "/fixtures",
        headers: {
        "X-Auth-Token": "a33900e1d9ff4b669c0be3bce52de7ec"
        }
    };
    
    var parseTable = function(){
        request(getTable, function (error, response, body) {
            console.log('getTable error:', error);
            console.log('getTable statusCode:', response && response.statusCode);
            var standingsList = JSON.parse(body);
            parseFixtures(standingsList);
        });
    };
    var parseFixtures = function(standingsList) {
        request(getFixtures, function (error, response, body) {
            console.log('getFixtures error:', error);
            console.log('getFixtures statusCode:', response && response.statusCode);
            var fixtureList = JSON.parse(body);
            sendData(standingsList, fixtureList);
        });
    };
    var sendData = function(standingsList, fixtureList){
        console.log("data sent");
        res.render("results", {standingsList: standingsList, fixtureList: fixtureList});
    };
    
    parseTable();
});

//Start the server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is listening.");
});