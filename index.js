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
            <div id='map'><iframe
            width="420"
            height="420"
            frameborder="0" style="border:0"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDFf91xJ4O4KtnZNK-bos0QnKt4V-VrqUk
              &q=${data.data.location}" allowfullscreen>
          </iframe></div>
            <p id='githubProf'>GitHub: <a href="${data.data.html_url}">${data.data.html_url}</a></p>
            <p id='userBlog'>Blog: <a href="${data.data.blog}">${data.data.blog}</a></p>
            <p id='userBio'>Bio: ${data.data.bio}</p>
            <p id='numRepos'>Number of Repositories: ${data.data.public_repos}</p>
            <p id="numFollow">Followers: ${data.data.followers}</p>
            <p id="gitStars">Number of Stars: ${data2.data[0].stargazers_count}</p>
            <p id='numUsersFollow'>Following: ${data.data.following}</p>
        </div>
    </body>
    </html>`
        fs.writeFile("index.html", $html, function(err){
            if (err) throw err;
            console.log("Error in writefile")
        })
        //     conversion({ html: $html }, (err, result) => {
        //         if (err) return console.log("Error in conversion");
        //         result.stream.pipe(fs.createWriteStream('./devProfile.pdf'));
        //         conversion.kill();
            
        // })
}

// const conversion = convertFactory({
//     converterPath: convertFactory.converters.PDF,
//     allowLocalFilesAccess: true
//   });

function start (){
    inquirer.prompt(questions).then(( { q1 , q2 } ) => {
        
        ask(q1 , q2)
    })
};

start();
