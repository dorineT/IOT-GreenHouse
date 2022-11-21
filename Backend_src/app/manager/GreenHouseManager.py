import sched

from datetime import datetime
from time import time, sleep
from threading import Thread

from app.manager.GreenHouse import GreenHouse


class GreenHouseManager(Thread):

    def __init__(
            self,
            green_house: GreenHouse,
            poll_mindelay: int = 30) -> None:

        self.scheduler: sched.scheduler = sched.scheduler(time, sleep)
        
        # REMEMBER: FIXME: set to minutes
        self.poll_mindelay: int = poll_mindelay * 60 * 30 
        
        self.green_house: GreenHouse = green_house

        super().__init__()

        self.daemon = True

    def _cron_job_sensors(self) -> None:
        """Fetches the sensor values from the phidget and
        computes the green house current state.

        Displays a minimal summary to the LCD screen
        """
        t0 = time()

        # Actualizing the sensors and computing the state
        # Of the green house
        self.green_house.actualize_all()
        state = self.green_house.current_state()

        # Displaying the state of the green house
        self.green_house.display(state)

        # Computing time delay necessary to run cron job
        # exactly poll_mindelay minutes after previous one
        elapsed = time() - t0
        ndelay = self.poll_mindelay - elapsed if self.poll_mindelay - elapsed > 0 else 0.0

        # Planning next job
        self.scheduler.enter(ndelay, 1, self._cron_job_sensors)

    def _cron_job_water(self) -> None:
        """Starts the watering of the green house.
        """

        # Time to water
        self.green_house.water()

        # Computing next delay
        ndelay = self._get_next_watering()

        # Planning next job
        self.scheduler.enter(ndelay, 0, self._cron_job_water)

    def _get_next_watering(self) -> float:
        """Returns the timestamp of the next watering

        :return: timestamp of next watering
        :rtype: float
        """
        now = datetime.now()
        new_time: datetime

        # It is at least 8h00 PM
        if now.hour >= 20:
            new_time = now.replace(
                day=now.day + 1,
                hour=8,
                minute=0,
                second=0,
                microsecond=0)
        # It is at least 8h00 AM
        elif now.hour >= 8:
            new_time = now.replace(
                day=now.day,
                hour=20,
                minute=0,
                second=0,
                microsecond=0)
        # It is at least 0h00 PM
        else:
            new_time = now.replace(
                day=now.day,
                hour=8,
                minute=0,
                second=0,
                microsecond=0)

        # Recomputing now() to be as exact as possible
        return new_time.timestamp() - datetime.now().timestamp()

    def run(self) -> None:
        self.scheduler.enter(self.poll_mindelay, 1, self._cron_job_sensors)
        self.scheduler.enter(
            self._get_next_watering(),
            0,
            self._cron_job_water)
        self.scheduler.run()

    def summary(self) -> dict[str, float | None]:
        """Returns a user-friendly dictionary containing the last values obtainend from
        the different phidgets. This action forces the actualization of the previous fetched
        values.

        :return: last phidgets values
        :rtype: dict[str, float | None]
        """
        self.green_house.actualize_all()
        
        state = self.green_house.current_state()
        # Displaying the state of the green house
        self.green_house.display(state)

        return self.green_house.get()

    def handle_watering(self, type: str = 'get') -> int | None:
        """Handles the water pump of the green house

        :param type: type of request: 'get', 'post'
        :type type: str
        :return: timestamp of last watering
        :rtype: int | None
        """
        match type:
            case 'get': return self.green_house.get_last_watering()
            case 'post': return self.green_house.water()  # TODO: put in own thread?
            case _: return self.green_house.get_last_watering()
