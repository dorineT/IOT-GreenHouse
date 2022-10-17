
import traceback

from threading import Thread

from Phidget22.PhidgetException import PhidgetException
from Phidget22.ErrorEventCode import ErrorEventCode
from Phidget22.Devices.LightSensor import LightSensor

from app.Sensors.Errors import NotYetAttachedError


class tLightSensor(Thread):

    _ls: LightSensor = LightSensor()

    @staticmethod
    def onLightSensor0_IlluminanceChange(self, illuminance):
        print("Illuminance: " + str(illuminance))

    @staticmethod
    def onLightSensor0_Error(self, code, description):
        print("Code: " + ErrorEventCode.getName(code))
        print("Description: " + str(description))
        print("----------")

    def run(self) -> None:
        try:
            # Create your Phidget channels
            # Set addressing parameters to specify which channel to open (if
            # any)
            self._ls.setHubPort(0)
            self._ls.setDeviceSerialNumber(672154)

            # Assign any event handlers you need before calling open so that no
            # events are missed.
            self._ls.setOnIlluminanceChangeHandler(
                tLightSensor.onLightSensor0_IlluminanceChange)
            self._ls.setOnErrorHandler(tLightSensor.onLightSensor0_Error)

            # Open your Phidgets and wait for attachment
            self._ls.openWaitForAttachment(5000)

        except PhidgetException as ex:
            # We will catch Phidget Exceptions here, and print the error
            # informaiton.
            traceback.print_exc()
            print("")
            print("PhidgetException " + str(ex.code) +
                  " (" + ex.description + "): " + ex.details)

    def value(self) -> float:
        """Gives the current illuminance value

        :raises NotYetAttachedError: when sensor is not attached, and thus unreandable
        :return: current illuminance value
        :rtype: float
        """
        if self._ls.getAttached():
            return self._ls.getIlluminance()
        raise NotYetAttachedError()
