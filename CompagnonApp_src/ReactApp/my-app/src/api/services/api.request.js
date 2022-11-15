// /poll = get
// /water = get/post

import api from "./api.js";

export default class Request {

  /**
   * Gets a request containing a JSON object containing all the greenhouse sensor information.
   * Contains the following: humidity, light, ph, co2, temperature (float | null), null if connection lost
   */
  getGreenhouseInfo() {

    return api.get("/poll");
  }

  /**
   * Gets a request containing the last time at which plants were watered.
   */
  getWaterTime() {

    return api.get("/water");
  }


  /**
   * Posts a request giving the time at which the plants have been watered.
   */
  sendWaterTime() {

    return api.post("/water");
  }
}
