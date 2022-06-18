'use strict';

let newValue = 0;

function updateDatabase() {
    newValue++
    return null
  }

exports.handler = async function(event, response) {
  //console.log("EVENT: \n" + JSON.stringify(event, null, 2))
  updateDatabase()
  return {
    statusCode: 200,
    body: JSON.stringify ({number:newValue})
  }
}