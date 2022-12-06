// /poll = get
import api from "./api.js";

export default class Request {

  /**
   * Gets a request containing a JSON object containing all the greenhouse sensor information.
   * Contains the following: humidity, light, ph, co2, temperature (float | null), null if connection lost
   */
  getGreenhouseInfo() { 
    return api.get('/poll', {timeout: 6000})   
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
    return api.get('/water', {timeout: 6000});
  }


  /**
   * Posts a request giving the time at which the plants have been watered.
   */
  sendWaterTime() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({'data':{"last_watering": 1668780738}});
      }, 400);
    });
    //return api.post('/water', {timeout: 6000});
    //if ok update new time arrosage in db with function updateLastWaterTime
  }
}
