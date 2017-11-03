import lxml
import json
from pykml import parser
from lxml import etree

#to access json data::::    print data[0]["drainflow"]

with open('doc.kml','rw') as stockKml:
    kmlstr = stockKml.read()

root = parser.fromstring(kmlstr)

json_data_files = ['allData-16Vol-Low.json', 'allData-16Vol-Medium.json', 'allData-16Vol-High.json',
                   'allData-48Vol-Low.json', 'allData-48Vol-Medium.json', 'allData-48Vol-High.json',
                   'allData-80Vol-Low.json', 'allData-80Vol-Medium.json', 'allData-80Vol-High.json']

kml_out_files = ['allData-16Vol-Low-percentCapDrainflow.kml','allData-16Vol-Medium-percentCapDrainflow.kml','allData-16Vol-High-percentCapDrainflow.kml',
                 'allData-48Vol-Low-percentCapDrainflow.kml','allData-48Vol-Medium-percentCapDrainflow.kml','allData-48Vol-High-percentCapDrainflow.kml',
                 'allData-16Vol-Low-percentCapDrainflow.kml','allData-48Vol-Medium-percentCapDrainflow.kml','allData-80ol-High-percentCapDrainflow.kml']

kml_index = 0
for datafile in json_data_files:
   with open(datafile) as data_file:
     data = json.load(data_file)
   i = 0
   while i < 11230 :
     val = data[i]["percentAnnualCapturedDrainflow"]
     polygon = root.Document.Folder.Placemark[i]
     if val < 1 :
      polygon.styleUrl = '#transBluePoly'
     elif val < 2 :
      polygon.styleUrl = '#transRedPoly'
     i+=1
   new_kml = open(kml_out_files[kml_index],'w')
   new_kml.write(etree.tostring(root,pretty_print=True))
   new_kml.close()
   kml_index += 1



