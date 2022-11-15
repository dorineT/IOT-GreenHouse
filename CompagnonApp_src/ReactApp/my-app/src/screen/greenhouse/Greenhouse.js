import { GreenhouseDiv, GreenhouseTitle, TemperatureBox, LightBox, HumidityBox, PhBox, ReloadButton, WaterButton } from "./styles";
import { useEffect, useState } from 'react';

export function GreenhouseScreen() {
  return(
    <GreenhouseDiv id={"greenhouse-div"}>
      <GreenhouseTitle>My Greenhouse</GreenhouseTitle>
    </GreenhouseDiv>
  );
}
