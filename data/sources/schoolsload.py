import csv
import json
#import urllib2

maxpmratio=0
minpmratio=10
maxpsratio=0
minpsratio=10

maxpmcity=''
minpmcity=''
maxpscity=''
minpscity=''

def addToBuckets(bucket, label, quantity):
    if bucket.has_key(label):
        bucket[label]+=quantity
    else:
        bucket[label]=quantity

def addToArray(bucket, label, quantity):
    if bucket.has_key(label):
        bucket[label].append(quantity)
    else:
        bucket[label]=[quantity]

def setBuckets(bucket, label, value):
    if bucket.has_key(label):
        print "overriding %s with %s" % (bucket[label], value)
    bucket[label]=value


#print pyramids
def addToPyramids(postcode, language, preschool, primary):
    global minpsratio, minpmratio, maxpsratio, maxpmratio, maxpscity, maxpmcity, minpscity, minpmcity
    bucket = pyramids[nisperpostcode[postcode]]

    if preschool.isdigit():
        addToBuckets(bucket, 'preschool', int(preschool))

    if primary.isdigit():
        addToBuckets(bucket, 'primary', int(primary))



    #if psratio > maxpsratio:
    #    maxpsratio = psratio
    #if pmratio > maxpmratio:
    #    maxpmratio = pmratio

def addWlStudents(inputfile, type):
    students =0
    schoolsfile= csv.reader(open(inputfile))
    for row in schoolsfile:
        nis=row[0]
        quantity=row[2]

        if pyramids.has_key(nis):
            #print postcode
            #print nisperpostcode 
            #print nisperpostcode[postcode]
            students += int(quantity)
            addToBuckets(pyramids[nis], type, int(quantity))
        else:
            print 'no FR %s INS found %s' % (type, nis)

    return students

#loading the postcode name
namesperpostcodefile = csv.reader(open('datasets/citynames.csv'))
# Read the column names from the first line of the file
fields = namesperpostcodefile.next()
namesperpostcode = {}
previousnis =''
for row in namesperpostcodefile:
        # Zip together the field names and values
   # items = zip(fields, row)
    #0 name
    #1 postcode 
    #2 nis 
    nis = row[2]
    if nis == '':
        nis = previousnis 
    else:
        previousnis= nis

    namesperpostcode[row[1]] = row[0]


print ('namesperpostcode done: %s' % len(namesperpostcode))

#some nis cover more than one postcode
#oh and some postcodes cover more than one nis....
#loading the nis-postcode
nisperpostcode = {}
postcodesfornis= {}
with open('datasets/postcodes') as f:
    postcodes = []
    for line in f:
        if line.startswith('INS:'):
            nis = line[4:-1]
            if postcodesfornis.has_key(nis):
                print 'duplicate nis :%s' % nis
            else:
                #print nis
                postcodesfornis[nis]=postcodes
            for postcode in postcodes:
                nisperpostcode[postcode]=nis
            postcodes=[]
        elif line[:-1].isdigit() :
            postcode = line[:-1]
            if postcodes.count(postcode)<1:
                postcodes.append(postcode)


#missing some postcode since some nis cover more than one postcode
#oh and some postcodes cover more than one nis....
print ('postcodesfornis done: %s' % len(postcodesfornis))
#print postcodesfornis


pyramids = {}
with open('datasets/population_age_gender.json') as jsondata:
    data = json.load(jsondata)
#pyramidfile= csv.reader(open('datasets/facts_2013_onlycommunes.csv'))
## Read the column names from the first line of the file
#fields = pyramidfile.next()
#for row in pyramidfile:
    #0 nis
    #1 sex
    #2 ageground
    #3 quantity
    for row in data['facts']:
        nis=row['g']
        agegroup=row['C']
        quantity=int(row['M'])
        year=int(row['y'])
        if agegroup == 4 or agegroup == 9 or agegroup==14 or agegroup==19:
            if postcodesfornis.has_key(nis):
                if pyramids.has_key(nis):
                    if pyramids[nis].has_key(agegroup+year):
                        #the other sex+
                        pyramids[nis][agegroup+year] += quantity
                    else:
                        #new age group
                        pyramids[nis][agegroup+year] = quantity
                else:
                    #grepping the name using the first post code city name, TODO
    #                print nis
                    #print nis
                    #print postcodesfornis[nis]
                    pyramids[nis]={agegroup:quantity,
                        'name':namesperpostcode[postcodesfornis[nis][0]],
                        'postcodes':postcodesfornis[nis],
                        'nis':nis}
            else:
                #this is normal, we have data for postcodesfornis representing higher level entities like 12000
                #print 'no nis found : %s' % nis
                pass
#reworking the age groups

print ('pyramids done: %s' % len(pyramids))

#id =0
for nis in pyramids:
    entry = pyramids[nis]
    entry['i']=3*int(entry[4+2013])/5
    entry['j']=(int(entry[9+2013]) + 2*int(entry[4+2013]))/5
    entry['k']=(4*int(entry[9+2013]) + 2*int(entry[14+2013]))/5
    entry['l']=(3*int(entry[14+2013]) + 3*int(entry[19+2013]))/5
    entry['i2k']=3*int(entry[4+2001])/5
    entry['j2k']=(int(entry[9+2001]) + 2*int(entry[4+2001]))/5
    entry['k2k']=(4*int(entry[9+2001]) + 2*int(entry[14+2001]))/5
    entry['l2k']=(3*int(entry[14+2001]) + 3*int(entry[19+2001]))/5
    del(entry[4+2013])
    del(entry[9+2013])
    del(entry[14+2013])
    del(entry[19++2013])
    del(entry[4+2001])
    del(entry[9+2001])
    del(entry[14+2001])
    del(entry[19++2001])

    #print json.dumps(entry)

    #opener = urllib2.build_opener(urllib2.HTTPHandler)
    #id = id +1
    #request = urllib2.Request('http://localhost:9200/ages/pyramids/%s' % id, data=json.dumps(entry))
    #request.add_header('Content-Type', 'your/contenttype')
    #request.get_method = lambda: 'PUT'
    #url = opener.open(request)
    #print 'inserted %s' % id

#load school data
#print pyramids

flschools = {}

with open('datasets/longlat_schools_NL') as f:
    for line in f:
        #line is idschool:jsondump
        id = line[:line.find(':')]
        jsonblob = line[line.find(":")+1:]
        location=json.loads(jsonblob)
        if len(location)>0:
            #print location[0][u'lon']
            #print location[0][u'lat']
            flschools[id]={'lon':location[0][u'lon'], 'lat':location[0][u'lat']}

students =0
nolocationfound=0
schoolsfile= csv.reader(open('datasets/Ecoles primaire-maternelle 2012_FLANDRE.csv'))
# Read thefirst row of garbage
schoolsfile.next()
schoolsfile.next()
for row in schoolsfile:
    #0 id 
    #1 name 
    #2 street 
    #3 city 
    id=row[0]
    name=row[1]
    street=row[2]
    city=row[3]
    postcode=row[4]
    maternelle=row[5]
    primaire=row[6]
    #print postcode
    #print maternelle
    #print primaire
    if nisperpostcode.has_key(postcode):
        #print "%s %s %s" % (postcode, maternelle, primaire)
        #print "%s" % nisperpostcode[postcode]
        if maternelle.isdigit():
            students += int(maternelle)
        if primaire.isdigit():
            students += int(primaire)
        addToPyramids(postcode, 'FL', maternelle, primaire)
        #print row[0]
        if flschools.has_key(id):
            school=flschools[id]
            school['name']=name
            school['language']='NL'
            school['address']="%s, %s, %s" % (street.strip(), city.strip(), postcode.strip())
            addToArray(pyramids[nisperpostcode[postcode]], 'schools', school)
        else:
            #print 'no location found for FL school %s' % id 
            nolocationfound += 1
            pass
    else:
        print 'postcode not found %s' % postcode

print 'no location found for %s NL schools' % nolocationfound 
print '%s students found in NL ' % students

schoolsfile= csv.reader(open('datasets/ecoles_fr.csv'))
# Read thefirst row of garbage
for row in schoolsfile:
    #0 id 
    #1 name 
    #2 street 
    #3 city 
    name=row[0]
    street=row[1]
    postcode=row[2]
    lat=row[3]
    lon=row[4]
    #print postcode
    #print maternelle
    #print primaire
    if nisperpostcode.has_key(postcode):
        #print row[0]
        if lon.isdigit() and lat.isdigit():
            school={'lon':int(lon)/10000000.,
                    'lat':int(lat)/10000000.,
                    'name':name,
                    'language': 'FR',
                    'address': "%s, %s" % (street.strip(), postcode.strip())}
            addToArray(pyramids[nisperpostcode[postcode]], 'schools', school)
        else:
            print 'no location found for FR school %s' % id 
        pass
    else:
        print 'postcode not found %s' % postcode

print '%s students found in FL' % students

students=0

schoolsfile= csv.reader(open('datasets/Ecoles primaire-maternelle-secondaire 2010_BXL.csv'))
# Read the column names from the first line of the file

# Read the column names from the first line of the file
postcodes= schoolsfile.next()
preschool= schoolsfile.next()
primary = schoolsfile.next()
#0 nis
#1 sex
#2 ageground
#3 quantity
idx = 0;
for postcode in postcodes:
    if postcode.isdigit():
        #print postcode
        #print nisperpostcode 
        #print nisperpostcode[postcode]
        students += int(preschool[idx])
        students += int(primary[idx])

        addToPyramids(postcode, 'FR', preschool[idx].strip(), primary[idx].strip())
        
    idx += 1

print '%s students found in BXL' % students


students=0

students = addWlStudents('datasets/preschool_quantity_FR.csv', 'preschool')
students += addWlStudents('datasets/primary_quantity_FR.csv', 'primary')

print '%s students found in WL' % students

for nis in pyramids:
    bucket = pyramids[nis]
    if bucket.has_key('primary'):
        pmratio = bucket['primary']/(bucket['k']*1.)
        if maxpmratio < pmratio:
            maxpmratio = pmratio
            maxpmcity=nis
        if minpmratio > pmratio:
            minpmratio = pmratio
            minpmcity=nis

    if bucket.has_key('preschool'):
        psratio = bucket['preschool']/(bucket['j']*1.)
        if maxpsratio < psratio:
            maxpsratio = psratio
            maxpscity=nis
        if minpsratio > psratio:
            minpsratio = psratio
            minpscity=nis
print '%s (%s) < preschool ratio < %s (%s)' % (minpsratio, minpscity, maxpsratio, maxpscity)
print '%s (%s) < primary ratio   < %s (%s)' % (minpmratio, minpmcity, maxpmratio, maxpmcity)

#print json.dumps(pyramids)
#with open('datasets/result.json', 'w') as fp:
#        json.dump(pyramids, fp)
if True:
#if False:
    with open('db.json') as geodata:
        data = json.load(geodata)
        print data.keys()
        for feature in data[u'features']:
            #for property in feature[u'properties']:
            #    if property == 'INS':
            feature[u'properties']['pyramid']=pyramids["%s" % feature[u'properties']['INS']]
                    #print feature[u'properties'][property]

    with open('../dbplus.json', 'w') as fp:
        #json.dump(data, fp, indent=4, separators=(',', ': '))
        json.dump(data, fp)

