"""
Creates list of files in the daily files
directory and then compares the list
with the files listed within index.csv.
"""

import csv
import os


daily_files = os.listdir("db/daily_files")

found_match = 0
no_match = 0

with open("db/index.csv", "r") as csvfile:
    reader = csv.reader(csvfile, delimiter=",")
    for row in reader:
        if row[4] in daily_files:
            found_match += 1
        else:
            no_match = 0

print("total files found:", str(len(daily_files)))
print("matches found:", str(found_match))
print("matches not found:", str(no_match))
