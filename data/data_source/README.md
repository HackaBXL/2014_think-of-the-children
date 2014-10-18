data coming from various sources

#postcodes

postcodes3 is a grep of all the urls listed on http://fr.wikipedia.org/wiki/Liste_des_communes_de_Belgique_par_population plus manual downloads for the following (the wikipedia links where invalid) :
- Baerle-Duc
- Héron 
- Kapellen
- Lint
- Machelen
- Moerbeke-Waas
- Nazareth
- Nieuwerkerken 
- Putte

Once downloaded the HTML files where concatenated in a single file using the following commands :
for i in *
do
  grep -i 'code postal' $i -A 30000 | grep -i 'code INS' $i -A 1 -B 30000 | grep -v '<td><b>' $i | grep -v '<td></td>' | grep -v '<a' | grep -v '<td ' > $i.v
done

for i in *.v
do
cat $i >> ../postcodes
done

then some more edting in vi to obtain the list of postcodes for each INS (first hte postcodes and then the INS). Most likely vi commands :
- :%s/<td>\([0-9][0-9][0-9][0-9][0-9]\)<\/td>/INS:\1/g
- :%s/<td>//g
- :%s/<\/td>//g
- :%s/<tr>//g
- :%s/<>//g

# cityname

citynames.cvs is issued from http://www.notrebelgique.be/fr/index.php?nv=37 by running:

for i in {A..Z}
do
wget "http://www.notrebelgique.be/fr/index.php?nv=38&let=$i&searchGo=1"
done

for i in index*
do
cat $i >> communes.csv
done

#ages

the ages are coming from http://visuals.economie.fgov.be/visuals/data/population_age_gender.json?d=20141017

the JSON data was then transformed in CSV for ingestion

#import.py

the import script will merge all the data and recalculate the age groups for our usage.

The original data is split in 0-4 5-9 10-14 15-19 but we only care about the 3-6 and 6-12 groups so we re-split the data
