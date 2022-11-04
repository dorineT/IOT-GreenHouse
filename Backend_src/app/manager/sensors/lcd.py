import logging

from threading import Thread
from queue import Queue

from Phidget22.Devices.LCD import LCD, LCDScreenSize, LCDFont
from Phidget22.PhidgetException import PhidgetException


EXIT_COMMAND = '$$exit'

class cLCD(Thread):

    def __init__(self,
                 logger: logging.Logger,
                 queue: Queue,
                 serial_number: int,
                 port: int,
                 timeout: int,
                 *args,
                 **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.daemon = True
        self.logger = logger
        self._screen = LCD()
        self.queue = queue
        self._serial_number = serial_number
        self._port = port
        self._timeout = timeout

    def handle_message(self, message: str) -> None:
        """Displays a given message to the screen

        :param message: message to display
        :type message: str
        """

        self._screen.clear()

        self._screen.writeText(
            LCDFont.FONT_6x12, 0, 10,
            message)
        
        self._screen.flush()

    def run(self) -> None:

        try:
            self._screen.openWaitForAttachment(self._timeout)
        except PhidgetException as e:
            self.logger.error(f'LCD sent {e}')
            return
        
        if not self._screen.getAttached():
            self._screen.close()
            self.logger.error(f'LCD screen was not attached with {self._timeout=}')
            return
        
        while 1:
            message = self.queue.get()

            if message == EXIT_COMMAND:
                break
            
            self.handle_message(message)

        self._screen.close()

