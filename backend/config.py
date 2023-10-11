import os

class BaseConfig(object):
    """Base configuration."""

    # main config
    SECRET_KEY = '1f40e1624f9ec2aa10a940889a8b8e19290ac1c295e044a816617380061835de65656df6f2a93f4ab2095ee9420890c32cdd379724dae3af6d20d9ef14de2233'
    SECRET_PASSWORD_SALT = '34a17e92326c9d01107b5a4b9bcc9ddaa123edb02f60d959572c1871215aba4094f191a1ba8b66381a8dd81eba2547b8f2d3ad7ff15c92fdaec8ae5437982793'

    # mail settings
    MAIL_SERVER = 'smtp.googlemail.com'
    MAIL_PORT = 465
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True

    # gmail authentication
    # MAIL_USERNAME = os.environ['APP_MAIL_USERNAME']
    # MAIL_PASSWORD = os.environ['APP_MAIL_PASSWORD']

    # mail accounts
    MAIL_DEFAULT_SENDER = 'jtanye03@gmail.com'

    @property
    def SQLALCHEMY_DATABASE_URI(self):
        return 'sqlite:///test.db'
    
    @property
    def IMAGE_FOLDER(self):
        return'./static'
    
    @property
    def QUARANTINE_FOLDER(self):
        return "./static/quarantine"