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

### Drivers

From [this page](https://www.phidgets.com/docs/Language_-_Python), install the Linux (?) drivers on the Raspberry. If you are on another platform, install the drivers accordingly.

## Launch the webserver

In dev mode:

```bash
flask run --host=0.0.0.0
```

Then, for example, curl at **<http://localhost:5000/poll>**

**In Production mode**: do no use flask but rather gunicorn and nginx (work for later)

gunicorn command (WiP - does not work on Windows):

```bash
gunicorn --bind 0.0.0.0:5000 wsgi:app
```

### Useful links

<https://artisan-roasterscope.blogspot.com/2017/01/connecting-phidgets-on-linux.html>  
<https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-gunicorn-and-nginx-on-ubuntu-20-04>
