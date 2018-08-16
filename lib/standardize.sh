#!/bin/bash

# Make build directory
mkdir -p data/build;

# Dakota county
in2csv "data/sources/2017 CFS Dakota County.xlsx" > data/build/dakota-county--all--all--2017.csv;

# Ramsey county
in2csv "data/sources/2017 Ramsey County Incidents/2017 FHFD Incidents.xlsx" > data/build/ramsey-county--FHFD--fire--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 LCFD Incidents.xlsx" > data/build/ramsey-county--LCFD--fire--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 LJFD Incidents.xlsx" > data/build/ramsey-county--LJFD--fire--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 MAFD Incidents.xlsx" > data/build/ramsey-county--MAFD--fire--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 MAPD Incidents.xlsx" > data/build/ramsey-county--MAPD--police--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 MVPD Incidents.xlsx" > data/build/ramsey-county--MVPD--police--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 NBFD Incidents.xlsx" > data/build/ramsey-county--NBFD--fire--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 NBPD Incidents.xlsx" > data/build/ramsey-county--NBPD--police--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 NSFD Incidents.xlsx" > data/build/ramsey-county--NSFD--fire--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 NSPD Incidents.xlsx" > data/build/ramsey-county--NSPD--police--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 RCSO Incidents.xlsx" > data/build/ramsey-county--RCSO--sheriff--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 RVFD Incidents.xlsx" > data/build/ramsey-county--RVFD--fire--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 RVPD Incidents.xlsx" > data/build/ramsey-county--RVPD--police--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 SAPD Incidents.xlsx" > data/build/ramsey-county--SAPD--police--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 SPFD Incidents.xlsx" > data/build/ramsey-county--SPFD--fire--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 SPPD Incidents.xlsx" > data/build/ramsey-county--SPPD--police--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 VHFD Incidents.xlsx" > data/build/ramsey-county--VHFD--fire--2017.csv;

# Airport
in2csv "data/sources/Airport Data March 7.xlsx" > data/build/airport--all--all--2017.csv;

# Anoka county
#in2csv "data/sources/Anoka County 911.xlsx" > data/build/anoka-county--all--all--2017.csv;
in2csv "data/sources/New AnokaCounty911.xlsx" > data/build/anoka-county--all--all--2017.csv;

# Bloomington
in2csv "data/sources/Bloomington 911 2017 part 1.xlsx" --sheet="Bloomington-StarTribune-Request" > data/build/bloomington--all--all--2017-01.csv;
in2csv "data/sources/Bloomington 911 2017 part 2.xlsx" > data/build/bloomington--all--all--2017-02.csv;

# Burnsville
in2csv "data/sources/Burnsville Law 2017 CFS - Redacted.xlsx" > data/build/burnsville--all--all--2017.csv;

# St Louis Park
in2csv "data/sources/StLouisPark 911 data/CAD Report 010117 thruogh 063017.xls" > data/build/st-louis-park--all--all--2017-01.csv;
in2csv "data/sources/StLouisPark 911 data/CAD Report 070117 through 123117.xls" > data/build/st-louis-park--all--all--2017-02.csv;

# Carver county
# Not tabular data with headers
in2csv "data/sources/carver county q1.xls" --no-header-row > data/build/carver-county--all--all--2017-01.csv;
in2csv "data/sources/carver county q2.xls" --no-header-row > data/build/carver-county--all--all--2017-02.csv;
in2csv "data/sources/carver county q3.xls" --no-header-row > data/build/carver-county--all--all--2017-03.csv;
in2csv "data/sources/carver county q4.xls" --no-header-row > data/build/carver-county--all--all--2017-04.csv;

# Eden Prarie
in2csv "data/sources/Star Tribune Request/April.xlsx" > data/build/eden-prarie--all--all--2017-04.csv;
in2csv "data/sources/Star Tribune Request/August.xlsx" > data/build/eden-prarie--all--all--2017-08.csv;
in2csv "data/sources/Star Tribune Request/December.xlsx" > data/build/eden-prarie--all--all--2017-12.csv;
in2csv "data/sources/Star Tribune Request/February.xlsx" > data/build/eden-prarie--all--all--2017-02.csv;
in2csv "data/sources/Star Tribune Request/January.xlsx" > data/build/eden-prarie--all--all--2017-01.csv;
in2csv "data/sources/Star Tribune Request/July.xlsx" > data/build/eden-prarie--all--all--2017-07.csv;
in2csv "data/sources/Star Tribune Request/June.xlsx" > data/build/eden-prarie--all--all--2017-06.csv;
in2csv "data/sources/Star Tribune Request/March.xlsx" > data/build/eden-prarie--all--all--2017-03.csv;
in2csv "data/sources/Star Tribune Request/May.xlsx" > data/build/eden-prarie--all--all--2017-05.csv;
in2csv "data/sources/Star Tribune Request/November.xlsx" > data/build/eden-prarie--all--all--2017-11.csv;
in2csv "data/sources/Star Tribune Request/October.xlsx" > data/build/eden-prarie--all--all--2017-10.csv;
in2csv "data/sources/Star Tribune Request/September.xlsx" > data/build/eden-prarie--all--all--2017-09.csv;

# Edina and Richfield
in2csv "data/sources/Edina/2018 Star Tribune CAD Request Edina PD FD and Richfield PD FD.xlsx" --sheet="EDINA POLICE" > data/build/edina--EP--police--2017.csv;
in2csv "data/sources/Edina/2018 Star Tribune CAD Request Edina PD FD and Richfield PD FD.xlsx" --sheet="EDINA FIRE" > data/build/edina--EF--fire--2017.csv;
in2csv "data/sources/Edina/2018 Star Tribune CAD Request Edina PD FD and Richfield PD FD.xlsx" --sheet="RICHFIELD POLICE" > data/build/richfield--RP--police--2017.csv;
in2csv "data/sources/Edina/2018 Star Tribune CAD Request Edina PD FD and Richfield PD FD.xlsx" --sheet="RICHFIELD FIRE" > data/build/richfield--RF--fire--2017.csv;

# Hennepin County
in2csv "data/sources/HennepinSherrif2017911.xlsx" > data/build/hennepin-county--all--all--2017.csv;

# Minneapolis and UofM
in2csv "data/sources/Minneapolis/911_Calls_Q12017.csv" > data/build/minneapolis--all--all--2017-01.csv;
in2csv "data/sources/Minneapolis/911_Calls_Q22017.csv" > data/build/minneapolis--all--all--2017-02.csv;
in2csv "data/sources/Minneapolis/911_Calls_Q32017.csv" > data/build/minneapolis--all--all--2017-03.csv;
in2csv "data/sources/Minneapolis/911_Calls_Q42017.csv" > data/build/minneapolis--all--all--2017-04.csv;
in2csv "data/sources/Minneapolis/911_Calls_UofM_2017.csv" > data/build/u-of-m--all--all--2017.csv;

# Scott County
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="January" > data/build/scott-county--all--all--2017-01.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="February" > data/build/scott-county--all--all--2017-02.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="March" > data/build/scott-county--all--all--2017-03.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="April" > data/build/scott-county--all--all--2017-04.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="May" > data/build/scott-county--all--all--2017-05.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="June" > data/build/scott-county--all--all--2017-06.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="July" > data/build/scott-county--all--all--2017-07.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="August" > data/build/scott-county--all--all--2017-08.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="September" > data/build/scott-county--all--all--2017-09.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="October" > data/build/scott-county--all--all--2017-10.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="November" > data/build/scott-county--all--all--2017-11.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="December" > data/build/scott-county--all--all--2017-12.csv;

# State Patrol
# Weird format
cp data/sources/Metro2017_.txt data/build/minnesota--state-patrol--police--2017.txt;

# Washington County
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 1" > data/build/washington-county--all--all--2017-01.csv;
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 2" > data/build/washington-county--all--all--2017-02.csv;
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 3" > data/build/washington-county--all--all--2017-03.csv;
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 4" > data/build/washington-county--all--all--2017-04.csv;
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 5" > data/build/washington-county--all--all--2017-05.csv;
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 6" > data/build/washington-county--all--all--2017-06.csv;
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 7" > data/build/washington-county--all--all--2017-07.csv;
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 8" > data/build/washington-county--all--all--2017-08.csv;
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 9" > data/build/washington-county--all--all--2017-09.csv;
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 10" > data/build/washington-county--all--all--2017-10.csv;
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 11" > data/build/washington-county--all--all--2017-11.csv;

# White Bear
in2csv "data/sources/White Bear Lake 2017.xlsx" > data/build/white-bear--all--all--2017.csv
