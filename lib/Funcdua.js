// random pick by win
const axios = require('axios')
const fetch = require('node-fetch')
const jimp = require('jimp')
const chalk = require('chalk')
const { spawn } = require('child_process')


const pickRandom = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};




module.exports = {
  pickRandom
};