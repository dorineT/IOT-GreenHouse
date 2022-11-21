import logging

from time import sleep

from Phidget22.Devices.DigitalOutput import DigitalOutput
from Phidget22.PhidgetException import PhidgetException


class cDOutput:

    def __init__(self,
                 logger: logging.Logger,
                 serial_number: int,
                 channel: int):
        self.logger = logger
        self._do = DigitalOutput()
        self._do.setDeviceSerialNumber(serial_number)
        self._do.setChannel(channel)

    def action(self, timeout: int, duration: int) -> None:
        """Activates the digital output for `duration` seconds

        :param timeout: max wait time until error
        :type timeout: int
        :param duration: duration of duty cyle
        :type duration: int
        """

        self.logger.info('Water pump activated')

        try:
            self._do.openWaitForAttachment(timeout)
        except PhidgetException as e:
            self._do.close()
            self.logger.error(f'DO sent {e}')
            self.logger.info('Water pump stopped')
            return

        if not self._do.getAttached():
            self._do.close()
            self.logger.error(
                f'DO was not attached with {timeout=}')
            self.logger.info('Water pump stopped')
            return

        try:
            # Activating the output for `duration` secs
            self._do.setDutyCycle(1)
            sleep(duration)
            self._do.setDutyCycle(0)
        except PhidgetException as e:
            self.logger.error(f'DO sent {e}')

        self._do.close()
        self.logger.info('Water pump stopped')
