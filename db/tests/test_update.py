import csv, json, datetime, os, time
from nose.tools import assert_equals
from db import sql_statements, update, setupdb
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

def removeLastLine():
    log = open("tests/index.csv")
    lines = log.readlines()
    log.close()
    log = open("tests/index.csv",'w')
    log.writelines([item for item in lines[:-1]])
    log.close()

class TestUpdate(object):
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

    def test_to_str_date(self):
        str_date = update.toStrDate('1995', '10', '24')
        assert_equals(str_date, '1995-10-24')

    def test_id_exists_in_index(self):
        update.index_file = 'tests/index.csv'
        assert update.idExistsInIndex('3')

    def test_id_doesnt_exists_in_index(self):
        update.index_file = 'tests/index.csv'
        assert_equals(update.idExistsInIndex('12'), False)

    def test_was_dbCreated(self):
        update.log_location = 'tests/.db.log'
        update.configureLog()
        assert update.dbCreated()

    def test_db_not_Created(self):
        update.log_location = 'tests/.fakedb.log'
        update.configureLog()
        assert_equals(update.dbCreated(), False)

    def test_update_index_addition(self):
        update.database = 'testTDP'
        update.log_location = 'tests/.db.log'
        update.index_file = 'tests/index.csv'
        time.sleep(1)
        index = open('tests/index.csv', 'a')
        index.write('6,6,36.1875,-90.0625,Daily_36.1875_-90.0625.txt,http://nevada.agriculture.purdue.edu/drains/Daily_36.1875_-90.0625.txt\n')
        index.close()
        update.configureMySQL()
        update.configureLog()
        update.update()
        cur.execute(sql_statements.check_table.format(database, 'Location6'))
        assert cur.fetchone() != None

    def test_update_index_removal(self):
        update.database = 'testTDP'
        update.log_location = 'tests/.db.log'
        update.index_file = 'tests/index.csv'
        time.sleep(1)
        removeLastLine()
        update.configureMySQL()
        update.configureLog()
        update.update()
        cur.execute(sql_statements.check_table.format(database, 'Location6'))
        assert_equals(cur.fetchone(), None)
