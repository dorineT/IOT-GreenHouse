# Flask WebServer

## Requirements

### Language

Language: **Python**  
Version: **3.10.7**

### Virtual environment

This webserver uses pipenv to manage its virtual environment. To install it, execute the following command:

```bash
pip install pipenv
```

Then to download the dependencies automaticaly, execute the following command:

```bash
pipenv install
```

To laucnh the virtual environment, execute the following command:

```bash
pipenv shell
```

### Drivers

From [this page](https://www.phidgets.com/docs/Language_-_Python), install the Linux drivers on the Raspberry. If it doesn't work, try following [this page](https://artisan-roasterscope.blogspot.com/2017/01/connecting-phidgets-on-linux.html)

## Launch the webserver

Clone the repository on the Raspberry. Make sure to connect the sensors as per indicated below:

**Sensor table**:
|             | HUB Serial Number | Channel | Port |
|-------------|-------------------|---------|------|
| Light       | 672154            | /       | 0    |
| Humidity    | 672154            | /       | 1    |
| Temperature | 672154            | /       | 2    |
| CO2         | 672154            | /       | 3    |
| PH          | 672154            | /       | 4    |
| LCD         | 672154            | /       | 5    |
| RELAY       | 319197            | 1       | /    |

### In Dev mode

In your virtual environment:

```bash
flask run --host=0.0.0.0
```

Then, for example, curl at **<http://localhost:5000/poll>**

### In Production mode

Do no use flask but rather gunicorn.

In your virtual environment:

```bash
gunicorn --workers 1 --bind 0.0.0.0:5000 wsgi:app
```

### Automating the server launch

1. Create a new *.service* file at `/etc/systemd/system/`, containing the rules to execute on startup and their configuration. It should ressemble this, where `<...>` should be replaced to reflect your needs:

    ```bash
    [Unit]
    Description=Gunicorn instance to serve <Your Project>
    After=network.target

    [Service]
    User=<user>
    Group=<user group>
    WorkingDirectory=<Path/to/source/dir>
    Environment=<"PATH=/Path/to/venv/bin">
    ExecStart=</Path/to/venv/bin/gunicorn> --workers 1 --bind 0.0.0.0:5000 wsgi:app &

    [Install]
    WantedBy=multi-user.target
    ```

2. Enable the new service with `sudo systemctl enable <service>` to enable it on startup
3. Start the new service if you want to use it now too with `sudo systemctl start <service>`
4. Reload the daemon with `sudo systemctl daemon-reload`
5. Open the port 5000 with `sudo ufw allow 5000`
6. Transform the Raspberry into a WiFi router so that you can connect yourself to it
7. Reboot the Raspberry
8. With a device connected to the Raspeberry WiFi, do a request at **10.42.0.1:5000** and enjoy!

## Available endpoints

|                   | URL    | Type | Description                                                                | Return Content-type | HTTP Code |
|-------------------|--------|------|----------------------------------------------------------------------------|---------------------|-----------|
| Poll sensors      | /poll  | GET  | Retrieves the values from all connected sensors                            | JSON                | 200       |
| Poll watering     | /water | GET  | Retrieves the last watering as a UNIX timestamp                            | JSON                | 200       |
| Activate watering | /water | POST | Activates the water pump and returns the last watering as a UNIX timestamp | JSON                | 201       |
