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

The, to download the dependencies automaticaly, execute the following command:

```bash
pipenv install
```

### Drivers

From [this page](https://www.phidgets.com/docs/Language_-_Python), install the Linux (?) drivers on the Raspberry. If you are on another platform, install the drivers accodingly.

## Launch the webserver

In dev mode:

```bash
flask --app \app.py run
```

Then, for example, curl at **<http://localhost:5000/light>**
