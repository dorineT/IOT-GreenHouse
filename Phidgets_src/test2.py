from Phidget22.Phidget import *
from Phidget22.Devices.DigitalOutput import *
import time

def main():
    digitalOutput1 = DigitalOutput()

    digitalOutput1.setDeviceSerialNumber(319197)
    digitalOutput1.setChannel(1)

    digitalOutput1.openWaitForAttachment(5000)

    digitalOutput1.setDutyCycle(1)

    try:
        input("Press Enter to Stop\n")
    except (Exception, KeyboardInterrupt):
        pass

    digitalOutput1.close()
    #digitalOutput1.setDutyCycle(0)

main()