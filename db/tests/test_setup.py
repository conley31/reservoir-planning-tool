##USAGE
##For general cases: nosetests -a '!slow'
##For complete validation of DB: nosetests -a '!fast'

import csv, json, datetime
from nose.tools import assert_equals
from nose.plugins.attrib import attr
from db import sql_statements
import MySQLdb as db

with open('../config/config.json') as json_data:
    config = json.load(json_data)

host = config.get("mysql").get("host")
user = config.get("mysql").get("user")
password = config.get("mysql").get("password")
database = config.get("mysql").get("database")
log_location = config.get("mysql").get("logLocation")

con = db.connect(host, user, password, database)
cur = con.cursor()

INCH_FACTOR = 0.03937007874

index_rows = []
with open('index.csv', 'rb') as csvfile:
    stream = csv.reader(csvfile, delimiter=',')
    for row in stream:
        index_rows.append(row)

def assertAlmostEqual(a, b):
    if abs(a - b) < 0.00001:
        return True
    return False

def compare_rows(test_row, rows):
    for row in rows:
        if test_row[0] == row[0]:
            assertAlmostEqual(test_row[1], row[1])
            assertAlmostEqual(test_row[2], row[2])
            assertAlmostEqual(test_row[3], row[3])
            return True
    return False

def get_table_name(input):
    return input[0]

def test_tables_names_exist():
    cur.execute(sql_statements.show_tables)
    tables = cur.fetchall()
    table_names = map(get_table_name, tables)
    for row in index_rows:
        assert(str('Location' + row[0]) in table_names)

def test_tables_equal():
    cur.execute(sql_statements.show_tables)
    tables = cur.fetchall()
    assert_equals(len(index_rows), len(tables))

def assert_table(loc_id):
    cur.execute(sql_statements.select_from.format(str('Location' + index_rows[loc_id][1])))
    rows = cur.fetchall()
    with open('daily_files/' + index_rows[loc_id][4], 'rb') as csvfile:
      stream = csv.reader(csvfile, delimiter=',')
      for row in stream:
          date = datetime.date(int(row[0]), int(row[1]), int(row[2]))
          drainflow = float('%.6f'%(INCH_FACTOR * float(row[3])))
          precipitation = float('%.6f'%(INCH_FACTOR * float(row[4])))
          PET = float('%.6f'%(INCH_FACTOR * float(row[5])))
          test_row = (date, drainflow, precipitation, PET)
          assert(compare_rows(test_row, rows))

@attr('fast')
def test_important_tables():
    assert_table(0)
    assert_table(len(index_rows) - 1)

@attr('slow')
def test_all_tables():
    for i in range(0, len(index_rows)):
        assert_table(i)
