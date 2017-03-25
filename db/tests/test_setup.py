import csv, json, time, sys, os.path, datetime
from nose.tools import assert_equals
from db import sql_statements
import MySQLdb as db

with open('../../config/config.json') as json_data:
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
with open('../index.csv', 'rb') as csvfile:
    stream = csv.reader(csvfile, delimiter=',')
    for row in stream:
        index_rows.append(row)

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

def test_table_first():
    cur.execute(sql_statements.select_from.format(str('Location' + index_rows[0][1])))
    rows = cur.fetchall()
    for row in rows:
        print(row)
    with open('../daily_files/' + index_rows[0][4], 'rb') as csvfile:
      stream = csv.reader(csvfile, delimiter=',')
      for row in stream:
          date = datetime.date(int(row[0]), int(row[1]), int(row[2]))
          drainflow = float('%.6f'%(INCH_FACTOR * float(row[3])))
          precipitation = float('%.6f'%(INCH_FACTOR * float(row[4])))
          PET = float('%.6f'%(INCH_FACTOR * float(row[5])))
          test_row = (date, drainflow, precipitation, PET)
          print(test_row)
          assert(test_row in rows)
