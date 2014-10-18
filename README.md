2014 Hackathon : Think of the Children
==================================

The purpose of this project is to cross population density and schools capacity in order to identify
places where children infrastructures (schools) are missing.

The result will be a single-page webapp which will use a consolidated JSON dataset.
Municipalities will be shown on a map.

## Used datasets

1. mapping zip code / ins code (wikipedia, scraped html, we fixed some missing/incorrect values on the way)
2. municipalities geometry per ins code (www.atlas-belgique.be, json)
3. population per age category and per ins code (statbel.fgov.be, json)
4. number of scholarized children per school (VGC/nl/bxl+vla, excel, each school has an address/zip code)
5. number of scholarized children per municipality/zip code (FWB/fr/bxl, excel)
6. number of scholarized children per municipality/zip code (FWB/fr/wal, excel)
7. geo-location of schools (FWB/fr, excel)
8. geo-location of schools (VGC/nl, reverse geo-coded with OpenStreetMap from excel (4))

## Assumptions, limitations, extrapolation

- the national institute for statistics (NIS) has population numbers by age category (0-4, 5-9, 10-14, 15-19) which
  do not match schools age categories (3-5: preschool, 6-12: primary), the data has been re-scaled linearly
- only preschools and primary schools were processed as secondary is much more diversified (which increases the difficulty to find good stats)
- the NIS has statistics on the population for 2001 and 2013, those numbers will be linearly extrapolated to 2015
- as no data exist about new schools being built or enlarged, we will only be able to see for which municipalities the situation will get worse first (~ red shift)

## Team members

- Antoine
- Dirk
- Nab
- Ulysse
- Xavier

## The process

It was not possible to provide a real-time service acting on the various datasources as our data come from excel files,
scraped wikipedia pages, vectorial geometries and reversed geo-coded addresses.
So we decided to pre-process the data and consolidate it by loading it in an elastic search instance.

![ThinkOfTheChildren](http://behindthenumbers.ca/wp-content/uploads/2014/07/Think-of-the-children.jpg)