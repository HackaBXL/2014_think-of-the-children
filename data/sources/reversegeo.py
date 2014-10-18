import csv
import json
import urllib2
import urllib

schoolsfile= csv.reader(open('datasets/Ecoles primaire-maternelle 2012_FLANDRE.csv'))
# Read thefirst row of garbage
schoolsfile.next()
schoolsfile.next()
for row in schoolsfile:
    #0 nis
    #1 sex
    #2 ageground
    #3 quantity
    street=row[2]
    city=row[3]
    postcode=row[4]
    #print postcode
    #print maternelle
    #print primaire
    address= urllib.quote_plus("%s, %s, %s, belgium" % (street.strip(), city.strip(), postcode.strip()))
    print "echo %s" % row[0]
    print "curl 'http://nominatim.openstreetmap.org/search?format=json&q=%s'" % (address)
    print "echo"

