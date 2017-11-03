import lxml
from pykml import parser
from lxml import etree

json_data_files = ['allData-16Vol-Low', 'allData-16Vol-Medium', 'allData-16Vol-High',
                   'allData-48Vol-Low', 'allData-48Vol-Medium', 'allData-48Vol-High',
                   'allData-80Vol-Low', 'allData-80Vol-Medium', 'allData-80Vol-High']
kml_out_files = ['allData-16Vol-Low-drainflow.kml

with open('doc.kml','rw') as stockKml:
    kmlstr = stockKml.read()

root = parser.fromstring(kmlstr)
print root.Document.Style.PolyStyle.color.text

for e in root.Document.Folder.Placemark:
    e.styleUrl = '#transBluePoly'

print root.Document.Folder.Placemark.styleUrl

new_kml = open('newkml.kml','w')
new_kml.write(etree.tostring(root,pretty_print=True))
new_kml.close()
