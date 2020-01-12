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
        choices: ["Blue", "Green", "Yellow", "Red"]
    }
]

function ask (q1,q2){
    console.log(q1,q2)

    axios.get(`https://api.github.com/users/${q1}?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`)
    .catch(function (error){
        console.log("Error in axios.get" , error)
    })
    .then(data => {
        console.log(data)
    })
}

function start (){
    inquirer.prompt(questions).then(( { q1 , q2 } ) => {
        
        ask(q1 , q2)
    })
};

start();