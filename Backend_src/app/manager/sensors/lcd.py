import logging

from threading import Thread
from queue import Queue

from Phidget22.Devices.LCD import LCD, LCDFont
from Phidget22.PhidgetException import PhidgetException

SPLIT = '$$split$$'

MUST_OPEN_CMD = f'Les plantes{SPLIT}souffrent!{SPLIT}Il faut ouvrir!'
MUST_CLOSE_CMD = f'Les plantes{SPLIT}souffrent!{SPLIT}Il faut fermer!'
MUST_WATER_CMD = f'Les plantes ont{SPLIT}soif! Il faut{SPLIT}les arroser!'
MUST_MOVE_CMD = f'Les plantes manquent{SPLIT}de lumiere! Il faut{SPLIT}les bouger!'
EVERYTHING_OK_CMD = f'Les plantes se{SPLIT}plaisent bien!'
SENSOR_MISSING_CMD = f'Oh non! Des capteurs{SPLIT}sont injoignables!{SPLIT}Il faut investiguer!'

EXIT_CMD = '$$exit$$'


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
        splitted = message.split(SPLIT)

        # If more than 3 lines, s will not be seen on the screen
        for idx, s in enumerate(splitted):
            self._screen.writeText(LCDFont.FONT_6x12, 0, 20 * idx, s)

        self.logger.info(f'LCD displayed {message=}')

        self._screen.flush()

    def run(self) -> None:

        try:
            self._screen.openWaitForAttachment(self._timeout)
        except PhidgetException as e:
            self._screen.close()
            self.logger.error(f'LCD sent {e}')
            return

        if not self._screen.getAttached():
            self._screen.close()
            self.logger.error(
                f'LCD screen was not attached with {self._timeout=}')
            return

        while True:
            message = self.queue.get()

            if message == EXIT_CMD:
                break

            self.handle_message(message)

        self._screen.close()
