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



#sets of kml files
kml_irrigationSuf_files = ['allData-16Vol-Low-irrigationSufficiency.kml','allData-16Vol-Medium-irrigationSufficiency.kml','allData-16Vol-High-irrigationSufficiency.kml',
                           'allData-48Vol-Low-irrigationSufficiency.kml','allData-48Vol-Medium-irrigationSufficiency.kml','allData-48Vol-High-irrigationSufficiency.kml',
                           'allData-16Vol-Low-irrigationSufficiency.kml','allData-48Vol-Medium-irrigationSufficiency.kml','allData-80ol-High-irrigationSufficiency.kml']

kml_irrigationDepthSup_files = ['allData-16Vol-Low-irrigationDepthSupplied.kml','allData-16Vol-Medium-irrigationDepthSupplied.kml','allData-16Vol-High-irrigationDepthSupplied.kml',
                                'allData-48Vol-Low-irrigationDepthSupplied.kml','allData-48Vol-Medium-irrigationDepthSupplied.kml','allData-48Vol-High-irrigationDepthSupplied.kml',
                                'allData-16Vol-Low-irrigationDepthSupplied.kml','allData-48Vol-Medium-irrigationDepthSupplied.kml','allData-80ol-High-irrigationDepthSupplied.kml']

kml_capturedFlow_files = ['allData-16Vol-Low-capturedFlow.kml','allData-16Vol-Medium-capturedFlow.kml','allData-16Vol-High-capturedFlow.kml',
                          'allData-48Vol-Low-capturedFlow.kml','allData-48Vol-Medium-capturedFlow.kml','allData-48Vol-High-capturedFlow.kml',
                          'allData-16Vol-Low-capturedFlow.kml','allData-48Vol-Medium-capturedFlow.kml','allData-80ol-High-capturedFlow.kml']


kml_percentCap_files = ['allData-16Vol-Low-percentCapDrainflow.kml','allData-16Vol-Medium-percentCapDrainflow.kml','allData-16Vol-High-percentCapDrainflow.kml',
                        'allData-48Vol-Low-percentCapDrainflow.kml','allData-48Vol-Medium-percentCapDrainflow.kml','allData-48Vol-High-percentCapDrainflow.kml',
                        'allData-16Vol-Low-percentCapDrainflow.kml','allData-48Vol-Medium-percentCapDrainflow.kml','allData-80ol-High-percentCapDrainflow.kml']


#database values

kml_drainflow_file = 'allyears-drainflow.kml'

kml_precipitation_file = 'allyears-drainflow.kml'

kml_PET_file = 'allyears-PET.kml'

kml_surfaceRunoff_file = 'allyears-surfaceRunoff.kml'

kml_DAEPET_file = 'allyears_DAEPET.kml'


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
     else:
      polygon.styleUrl = '#transRedPoly'
     i+= 1
   new_kml = open(kml_percentCap_files[kml_index],'w')
   new_kml.write(etree.tostring(root,pretty_print=True))
   new_kml.close()

   i = 0
   while i < 11230 :
     val = data[i]["irrigationSufficiency"]
     polygon = root.Document.Folder.Placemark[i]
     if val < 1 :
      polygon.styleUrl = '#transGREENPoly'
     else:
      polygon.styleUrl = '#transYELLOWPoly'
     i += 1
   new_kml = open(kml_irrigationSuf_files[kml_index],'w')
   new_kml.write(etree.tostring(root,pretty_print=True))
   new_kml.close()
   i = 0
   while i < 11230 :
     val = data[i]["annualIrrigationDepthSupplied"]
     polygon = root.Document.Folder.Placemark[i]
     if val < 1 :
      polygon.styleUrl = '#transGREENPoly'
     else:
      polygon.styleUrl = '#transYELLOWPoly'
     i += 1
   new_kml = open(kml_irrigationDepthSup_files[kml_index],'w')
   new_kml.write(etree.tostring(root,pretty_print=True))
   new_kml.close()
   i = 0
   while i < 11230 :
     val = data[i]["capturedFlow"]
     polygon = root.Document.Folder.Placemark[i]
     if val < 1 :
      polygon.styleUrl = '#transGREENPoly'
     else:
      polygon.styleUrl = '#transYELLOWPoly'
     i += 1
   new_kml = open(kml_capturedFlow_files[kml_index],'w')
   new_kml.write(etree.tostring(root,pretty_print=True))
   new_kml.close()


   kml_index += 1


#generate kml for database files
with open(json_data_files[0]) as data_file:
   data = json.load(data_file)
   #drainflow
   i = 0
   while i < 11230 :
     val = data[i]["drainflow"]
     polygon = root.Document.Folder.Placemark[i]
     if val < 1 :
      polygon.styleUrl = '#transBluePoly'
     else:
      polygon.styleUrl = '#transRedPoly'
     i+= 1
   new_kml = open(kml_drainflow_file,'w')   
   new_kml.write(etree.tostring(root,pretty_print=True))
   new_kml.close()
   #precipitation
   i = 0
   while i < 11230 :
     val = data[i]["precipitation"]
     polygon = root.Document.Folder.Placemark[i]
     if val < 1 :
      polygon.styleUrl = '#transBluePoly'
     else:
      polygon.styleUrl = '#transRedPoly'
     i+= 1
   new_kml = open(kml_precipitation_file,'w')   
   new_kml.write(etree.tostring(root,pretty_print=True))
   new_kml.close()
   #pet
   i = 0
   while i < 11230 :
     val = data[i]["pet"]
     polygon = root.Document.Folder.Placemark[i]
     if val < 1 :
      polygon.styleUrl = '#transBluePoly'
     else:
      polygon.styleUrl = '#transRedPoly'
     i+= 1
   new_kml = open(kml_PET_file,'w')   
   new_kml.write(etree.tostring(root,pretty_print=True))
   new_kml.close()
   #surfacerunoff
   i = 0
   while i < 11230 :
     val = data[i]["surfacerunoff"]
     polygon = root.Document.Folder.Placemark[i]
     if val < 1 :
      polygon.styleUrl = '#transBluePoly'
     else:
      polygon.styleUrl = '#transRedPoly'
     i+= 1
   new_kml = open(kml_surfaceRunoff_file,'w')   
   new_kml.write(etree.tostring(root,pretty_print=True))
   new_kml.close()
   #dea_pet
   i = 0
   while i < 11230 :
     val = data[i]["dae_pet"]
     polygon = root.Document.Folder.Placemark[i]
     if val < 1 :
      polygon.styleUrl = '#transBluePoly'
     else:
      polygon.styleUrl = '#transRedPoly'
     i+= 1
   new_kml = open(kml_DAEPET_file,'w')   
   new_kml.write(etree.tostring(root,pretty_print=True))
   new_kml.close()









