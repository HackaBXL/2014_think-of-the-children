2014 Hackathon : Think of the Children
==================================

The purpose of this project is to cross population density and schools capacity in order to identify
places where children infrastructures (schools) are missing.

The result will be a single-page webapp which will use a consolidated JSON dataset.
Municipalities will be shown on a map.

## Used datasets

- mapping zip code / ins code (wikipedia + we fixed some missing/incorrect values on the way)
- municipalities geometry per ins code (www.atlas-belgique.be)
- population per age category and per ins code (statbel.fgov.be)
- number of scholarized children per school (VGC/nl, + address --> zip code)
- number of scholarized children per municipality (FWB/fr, each municipality having a zip code)
- geo-location of schools (FWB/fr)
- geo-location of schools (VGC/nl, reverse geo-coded with OpenStreetMap)

## Assumptions and extrapolation

- the national institute for statistics (NIS) has population numbers by age category (0-4, 5-9, 10-14, 15-19) which
  do not match schools age categories (3-5: preschool, 6-12: primary), the data has been re-scaled linearly
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