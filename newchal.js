const express = require('express');
const request = require('request');
const hbs = require('hbs');
const fs = require('fs');

var weather = ''; //variable to hold the weather info
var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.use((request, response, next) => {
    response.render('main.hbs')
});

app.use((request, response, next) => {
    var time = new Date().toString();
    //console.log(`${time}: ${request.method} ${request.url}`);
    var log = `${time}: ${request.method} ${request.url}`;
    fs.appendFile('server.log', log + '\n', (error) => {
        if (error) {
            console.log('Unable to log message');
        }
    });
    next();
});

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('message', (text) => {
    return text.toUpperCase();
});



app.get('/home', (request, response) => {
    response.render('home.hbs', {
        1: 'about',
        2: 'weather',
        year: new Date().getFullYear(),
        welcome: 'hi',
        img: 'https://cdn3.volusion.com/setuf.jdraj/v/vspfiles/photos/5004-2.jpg?1445188867'
    });
});

app.get('/weather', (request, response) => {
    response.render('weather.hbs', {
        1: 'home',
        2: 'about',
        weat: weather,
        year: new Date().getFullYear(),
        welcome: 'hi'
    });

});

app.get('/about', (request, response) => {

    response.render('about.hbs', {
        1: 'home',
        2: 'weather',
        title: 'About page',
        year: new Date().getFullYear(),
        welcome: 'hi'
    });
});

app.listen(8080, () => {
    console.log('Server is up on the port 8080');

    function getWeather(callback) {
        request({
            url: 'https://api.darksky.net/forecast/7ef3300d64dd59e230ad77437ca2a654/25.2711,55.3075',
            json: true
        }, (error, response, body) => {
            if (error) {
                console.log(error)
                callback("can't connect to darksky api");

            } else if (body.status == 'The given location is invalid.') {
                callback("can't find requested address");

            } else {
                callback(undefined, body.currently.icon);
            }

        });
    };

    getWeather((errorMessage, results) => {
        if (errorMessage) {
            console.log(errorMessage);
        } else {
            weather = JSON.stringify(results, undefined, 2);
        }
    });
});