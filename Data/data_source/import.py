import csv
import json
import urllib2



#loading the postcode name
citynamesfile = csv.reader(open('citynames.csv'))
# Read the column names from the first line of the file
fields = citynamesfile.next()
citynames = {}
previousnis =''
for row in citynamesfile:
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

    citynames[row[1]] = row[0]


print ('citynames done: %s' % len(citynames))

#some nis cover more than one postcode
#oh and some postcodes cover more than one nis....
#loading the nis-postcode
postcodesfornis= {}
with open('postcodes3') as f:
    postcodes = []
    for line in f:
        if line.startswith('INS:'):
            nis = line[4:-1]
            if postcodesfornis.has_key(nis):
                print 'duplicate nis :%s' % nis
            else:
                #print nis
                postcodesfornis[nis]=postcodes
            postcodes=[]
        elif line[:-1].isdigit() :
            postcode = line[:-1]
            if postcodes.count(postcode)<1:
                postcodes.append(postcode)


#missing some postcode since some nis cover more than one postcode
#oh and some postcodes cover more than one nis....
print ('postcodesfornis done: %s' % len(postcodesfornis))
#print postcodesfornis


pyramidfile= csv.reader(open('facts_2013_onlycommunes.csv'))
# Read the column names from the first line of the file
fields = pyramidfile.next()
pyramids = {}
for row in pyramidfile:
    #0 nis
    #1 sex
    #2 ageground
    #3 quantity
    nis=row[0]
    agegroup=row[2]
    quantity=int(row[3])
    if agegroup == '4' or agegroup == '9' or agegroup=='14' or agegroup=='19':
        if postcodesfornis.has_key(nis):
            if pyramids.has_key(nis):
                if pyramids[nis].has_key(agegroup):
                    #the other sex
                    pyramids[nis][agegroup] += quantity
                else:
                    #new age group
                    pyramids[nis][agegroup] = quantity
            else:
                #grepping the name using the first post code city name, TODO
#                print nis
                #print nis
                #print postcodesfornis[nis]
                pyramids[nis]={row[2]:quantity,
                    'name':citynames[postcodesfornis[nis][0]],
                    'postcodes':postcodesfornis[nis],
                    'nis':nis}
        else:
            #this is normal, we have data for postcodesfornis representing higher level entities like 12000
             #print 'no nis found : %s' % nis
            pass
#reworking the age groups

print ('pyramids done: %s' % len(pyramids))

id =0
for nis in pyramids:
    entry = pyramids[nis]
    entry['i']=3*int(entry['4'])/5
    entry['j']=(int(entry['9']) + 2*int(entry['4']))/5
    entry['k']=(4*int(entry['9']) + 2*int(entry['14']))/5
    entry['l']=(3*int(entry['14']) + 3*int(entry['19']))/5
    del(entry['4'])
    del(entry['9'])
    del(entry['14'])
    del(entry['19'])

    #print json.dumps(entry)

    #opener = urllib2.build_opener(urllib2.HTTPHandler)
    #id = id +1
    #request = urllib2.Request('http://localhost:9200/ages/pyramids/%s' % id, data=json.dumps(entry))
    #request.add_header('Content-Type', 'your/contenttype')
    #request.get_method = lambda: 'PUT'
    #url = opener.open(request)
    #print 'inserted %s' % id
   
#print json.dumps(pyramids)
#with open('result.json', 'w') as fp:
#        json.dump(pyramids, fp)

with  open('db.json') as geodata:
    data = json.load(geodata)
    print data.keys()
    for feature in data[u'features']:
        #for property in feature[u'properties']:
        #    if property == 'INS':
        feature[u'properties']['pyramid']=pyramids["%s" % feature[u'properties']['INS']]
                #print feature[u'properties'][property]

with open('dbplus.json', 'w') as fp:
    json.dump(data, fp, indent=4, separators=(',', ': '))

#print pyramids
