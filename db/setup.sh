#!/bin/bash

#mysql --user=root --password=PxrhjGtvWwC4^X%Z -e 'CREATE DATABASE TDP'

file="index.csv"
while IFS=, read -r FID ID Latitute Longitude TextFile URL
do
    echo "$ID:$TextFile"
    while IFS=$'\t' read -r year month day drainflow precipitation PET
    do
        echo "$precipitation:$PET"
    done <"DWR_DAILY_FILES/$TextFile"
done <"$file"
