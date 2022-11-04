import sched

from time import time, sleep
from threading import Thread

from app.manager.GreenHouse import GreenHouse


class GreenHouseManager(Thread):

    def __init__(
            self,
            green_house: GreenHouse,
            poll_mindelay: int = 30) -> None:

        self.scheduler: sched.scheduler = sched.scheduler(time, sleep)
        self.poll_mindelay: int = poll_mindelay * 6
        self.green_house: GreenHouse = green_house

        super().__init__()

    def _cron_job(self) -> None:
        """Fetches the sensor values from the phidget and
        computes the green house current state.

        Decides if its necessary to water the green house.
        Displays a minimal summary to the LCD screen
        """
        t0 = time()

        # Put here the greenhouse logic here
        self.green_house.actualize_all()

        # Computing time delay necessary to run cron job
        # exactly poll_mindelay minutes after previous one
        elapsed = time() - t0
        ndelay = self.poll_mindelay - elapsed if self.poll_mindelay - elapsed > 0 else 0.0

        # Planning next job
        self.scheduler.enter(ndelay, 1, self._cron_job)

    def run(self) -> None:
        self.scheduler.enter(self.poll_mindelay, 1, self._cron_job)
        self.scheduler.run()

    def summary(self) -> dict[str, float | None]:
        """Returns a user-friendly dictionary containing the last values obtainend from
        the different phidgets. This action forces the actualization of the previous fetched
        values.

        :return: last phidgets values
        :rtype: dict[str, float | None]
        """
        self.green_house.actualize_all()
        return {stype.value: value
                for stype, _, value in self.green_house.sensors}
