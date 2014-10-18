INS-postcode mapping

for i in $(grep http list.csv)\ndo\nwget "$i"\ndone
for i in *\ndo\ngrep -i 'code postal' $i -A 30000 > $i.short\ndone
for i in *.short\ndo\ngrep -i 'code INS' $i -A 1 -B 30000 > $i.veryshort\ndone
for i in *veryshort\ndo\ngrep -v '<td><b>' $i | grep -v '<td></td>' | grep -v '<a' | grep -v '<td ' > $i.v\ndone
for i in *.v\ndo\ncat $i >> ../postcodes\ndone

