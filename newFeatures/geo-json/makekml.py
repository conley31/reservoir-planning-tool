import lxml
from pykml import parser
from lxml import etree

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
