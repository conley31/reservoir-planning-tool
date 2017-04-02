import csv, json, datetime, os, time
from nose.tools import assert_equals
from db import sql_statements, setupdb, remove
import MySQLdb as db

with open('../config/config.json') as json_data:
    config = json.load(json_data)

host = config.get("mysql").get("host")
user = config.get("mysql").get("user")
password = config.get("mysql").get("password")
database = 'testTDP'
log_location = config.get("mysql").get("logLocation")

con = db.connect(host, user, password)
cur = con.cursor()
cur.execute('CREATE DATABASE IF NOT EXISTS testTDP;')
con.close()
con = db.connect(host, user, password, database)
cur = con.cursor()

class TestDestroy(object):
    @classmethod
    def setup_class(self):
        setupdb.database = 'testTDP'
        setupdb.index_file = 'tests/index.csv'
        setupdb.log_location = 'tests/.db.log'
        cur.execute(sql_statements.select_table_count.format(database))
        if cur.fetchone()[0] > 0:
            print("Tables are already setup for testTDP")
        else:
            setupdb.setupDB()

    def test_erase_log(self):
        remove.log_location = 'tests/.db.log'
        remove.eraseLog()
        assert_equals(os.path.isfile('tests/.db.log'), False)
