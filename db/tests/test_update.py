import csv, json, datetime, os
from nose.tools import assert_equals
from nose.plugins.attrib import attr
from db import sql_statements, update, setupdb
import MySQLdb as db

with open('../config/config.json') as json_data:
    config = json.load(json_data)

host = config.get("mysql").get("host")
user = config.get("mysql").get("user")
password = config.get("mysql").get("password")
database = 'testTDP'
log_location = config.get("mysql").get("logLocation")

con = db.connect(host, user, password, database)
cur = con.cursor()

def test_to_str_date():
    str_date = update.toStrDate('1995', '10', '24')
    assert_equals(str_date, '1995-10-24')

def setup_func():
    setupdb.database = 'testTDP'
    setupdb.index_file = 'tests/index.csv'
    setupdb.setupDB()
