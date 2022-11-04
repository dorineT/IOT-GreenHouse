import logging
import logging.handlers
import os.path

def rfh_logger(logger: logging.Logger, path: str, *, max_bytes: int, backup_count: int) -> None:
    """Attaches a generic rotating file handler

    :param logger: base logger
    :type logger: logging.Logger
    :param path: path to the log file
    :type path: str
    :param max_bytes: maximum bytes per file
    :type max_bytes: int
    :param backup_count: number of backups if `max_bytes` is exceeded
    :type backup_count: int
    """

    # Rotating file handler to manage log file size and number
    handler = logging.handlers.RotatingFileHandler(
        filename=os.path.abspath(path),
        mode='a',
        maxBytes=1024*1024,
        backupCount=1)
    handler.setLevel(logging.DEBUG)

    # Simple formatter
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(filename)s:%(lineno)s - %(funcName)s() >>> %(message)s')
    
    # Attaching everything to the logger
    handler.setFormatter(formatter)
    logger.addHandler(handler)


def green_house_logger() -> logging.Logger:
    """Creates a Rotating File Handler to log the activity
    of the green_house

    :return: created rotating file handler
    :rtype: logging.Logger
    """
    gh_logger = logging.getLogger('green_house')
    gh_logger.setLevel(logging.DEBUG)
    
    rfh_logger(gh_logger, './app/logs/green_house.log', max_bytes=1024*1024, backup_count=1)

    return gh_logger

def request_logger() -> logging.Logger:
    """Creates a Rotating File Handler to log the requests
    received from the companion app

    :return: created rotating file handler
    :rtype: logging.Logger
    """

    r_logger = logging.getLogger('requests')
    r_logger.setLevel(logging.DEBUG)

    rfh_logger(r_logger, './app/logs/requests.log', max_bytes=1024*1024, backup_count=1)

    return r_logger
