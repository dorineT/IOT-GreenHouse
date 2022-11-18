// /poll = get
// /water = get/post

import api from "./api.js";

export default class Request {

  /**
   * Gets a request containing a JSON object containing all the greenhouse sensor information.
   * Contains the following: humidity, light, ph, co2, temperature (float | null), null if connection lost
   */
  getGreenhouseInfo() {
    let objfake = {
      'humidity' : 40,
      'light' : 300,
      'ph' : 6,
      'co2' : 200,
      'temperature' : 23.9
    };
    return new Promise((resolve) =>{
      setTimeout(() => {
        resolve(objfake)
      }, 400);
    });
    //return api.get("/poll");
  }

  /**
   * Gets a request containing the last time at which plants were watered.
   */
  getWaterTime() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({"last_watering": 1668780738});
      }, 400);
    });
    //return api.get("/water");
  }


  /**
   * Posts a request giving the time at which the plants have been watered.
   */
  sendWaterTime() {
    return {};
    //return api.post("/water");
  }
}
