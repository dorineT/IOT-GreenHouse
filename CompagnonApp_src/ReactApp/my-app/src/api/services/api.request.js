// /poll = get
// /water = get/post

import api from "./api.js";

export default class Request {

  /**
   * Gets a request containing a JSON object containing all the greenhouse sensor information.
   * Contains the following: humidity, light, ph, co2, temperature (float | null), null if connection lost
   */
  getGreenhouseInfo() {
    /*let objfake = {
      'humidity' : 60,
      'light' : 30000,
      'ph' : 9,
      'co2' : 1000,
      'temperature' :28
    };
    return new Promise((resolve, reject) =>{
      setTimeout(() => {
        resolve(objfake)
        //reject('test') test error handling
      }, 300);
    });*/
    return api.get("/poll");
  }

  /**
   * Gets a request containing the last time at which plants were watered.
   */
  getWaterTime() {    
    /*return new Promise((resolve) => {
      setTimeout(() => {
        resolve({"last_watering": 1668780738});
      }, 400);
    });*/
    return api.get("/water");
  }


  /**
   * Posts a request giving the time at which the plants have been watered.
   */
  sendWaterTime() {
    console.log('plouf')
    return api.post("/water");
    //if ok update new time arrosage in db with function updateLastWaterTime
  }
}
