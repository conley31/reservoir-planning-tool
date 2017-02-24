check_table = """ SELECT COUNT(*)
            FROM information_schema.tables
            WHERE table_name = '{}';"""

get_tables = """SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES
                WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA='TDP';"""

make_table = """CREATE TABLE IF NOT EXISTS Location{}
              (RecordedDate Date NOT NULL,
              Drainflow FLOAT DEFAULT NULL,
              Precipitation FLOAT DEFAULT NULL,
              PET FLOAT DEFAULT NULL,
              PRIMARY KEY (RecordedDate)
              );"""

insert = """INSERT INTO Location{} 
          (RecordedDate, Drainflow, Precipitation, PET)
          VALUES (STR_TO_DATE('{}', '%Y-%m-%d'), {}, {}, {});"""

drop_table = "DROP TABLE Location{};"
