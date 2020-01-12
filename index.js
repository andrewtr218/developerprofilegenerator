const fs = require("fs")
const inquirer = require("inquirer");
const axios = require("axios");
const convertFactory = require("electron-html-to")
require("dotenv").config();

const questions = [
    {
        type: "input",
        name: "q1",
        message: "What is your github username?"
    },
    {
        type: "list",
        name: "q2",
        message: "What is your favorite color?",
        choices: ["Blue", "Green", "Yellow", "Pink"]
    }
]

function ask (q1,q2){
    console.log(q1,q2)

    axios.get(`https://api.github.com/users/${q1}?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`)
    .catch(function (error){
        console.log("Error in axios.get" , error)
    })
    .then(data => {
        axios.get(`https://api.github.com/users/${q1}/starred?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`)
        .catch(function (error){
            console.log("Error in axios.get" , error)
        })
        .then(data2 => {
            console.log(data2)
            console.log(data)
            dataPick(data, data2, q2)
        })
    
    })
}

function dataPick(data, data2, q2){
    const $html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <style>
      /* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
      #map {
        height: 420px;
        width: 420px;
      }
      /* Optional: Makes the sample page fill the window. */
      html, body {
        background: light${q2};
        height: 100%;
        margin: 0;
        padding: 0;
        max-width: 500px;
        margin: auto;
      }
    </style>
    </head>
    <body>
        <div>
            <img id="profPic" src="${data.data.avatar_url}"></img>
        </div>
        <div>
            <p id='userName'>Username: ${data.data.login}</p>
            <p id='map'></p>
            <p id='githubProf'>GitHub: <a href="${data.data.html_url}">${data.data.html_url}</a></p>
            <p id='userBlog'>Blog: <a href="${data.data.blog}">${data.data.blog}</a></p>
            <p id='userBio'>Bio: ${data.data.bio}</p>
            <p id='numRepos'>Number of Repositories: ${data.data.public_repos}</p>
            <p id="numFollow">Followers: ${data.data.followers}</p>
            <p id="gitStars">Number of Stars: ${data2.data[0].stargazers_count}</p>
            <p id='numUsersFollow'>Following: ${data.data.following}</p>
        </div>
        <script>
      // Note: This example requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.
      var map, infoWindow;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 6
        });
        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              "Error: The Geolocation service failed." :
                              "Error: Your browser doesn\'t support geolocation.");
        infoWindow.open(map);
      }
    </script>
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDFf91xJ4O4KtnZNK-bos0QnKt4V-VrqUk&callback=initMap">
    </script>
    </body>
    </html>`
        fs.writeFile("index.html", $html, function(err){
            if (err) throw err;
            console.log("Error in writefile")
        })
}

function start (){
    inquirer.prompt(questions).then(( { q1 , q2 } ) => {
        
        ask(q1 , q2)
    })
};

start();