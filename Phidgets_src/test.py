# avec vint
#Add Phidgets library
from Phidget22.Phidget import *
from Phidget22.Devices.TemperatureSensor import *
#Required for sleep statement
import time

#Create
temperatureSensor = TemperatureSensor()
temperatureSensor.setHubPort(0)
#Open
temperatureSensor.openWaitForAttachment(5000)

#Use your Phidgets
while (True):    
    print("Temperature: " + str(temperatureSensor.getTemperature()) + "°C\n")
    time.sleep(0.5)

  