#!/bin/bash
# Assumed to be run from the root of this project

# Make build directory
mkdir -p data/build;

# Dakota county
in2csv "data/sources/2017 CFS Dakota County.xlsx" | csvformat -l > data/build/dakota-county--all--all--2017.csv;

# Ramsey county
in2csv "data/sources/2017 Ramsey County Incidents/2017 FHFD Incidents.xlsx" | csvformat -l > data/build/ramsey-county--FHFD--fire--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 LCFD Incidents.xlsx" | csvformat -l > data/build/ramsey-county--LCFD--fire--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 LJFD Incidents.xlsx" | csvformat -l > data/build/ramsey-county--LJFD--fire--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 MAFD Incidents.xlsx" | csvformat -l > data/build/ramsey-county--MAFD--fire--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 MAPD Incidents.xlsx" | csvformat -l > data/build/ramsey-county--MAPD--police--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 MVPD Incidents.xlsx" | csvformat -l > data/build/ramsey-county--MVPD--police--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 NBFD Incidents.xlsx" | csvformat -l > data/build/ramsey-county--NBFD--fire--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 NBPD Incidents.xlsx" | csvformat -l > data/build/ramsey-county--NBPD--police--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 NSFD Incidents.xlsx" | csvformat -l > data/build/ramsey-county--NSFD--fire--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 NSPD Incidents.xlsx" | csvformat -l > data/build/ramsey-county--NSPD--police--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 RCSO Incidents.xlsx" | csvformat -l > data/build/ramsey-county--RCSO--sheriff--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 RVFD Incidents.xlsx" | csvformat -l > data/build/ramsey-county--RVFD--fire--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 RVPD Incidents.xlsx" | csvformat -l > data/build/ramsey-county--RVPD--police--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 SAPD Incidents.xlsx" | csvformat -l > data/build/ramsey-county--SAPD--police--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 SPFD Incidents.xlsx" | csvformat -l > data/build/ramsey-county--SPFD--fire--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 SPPD Incidents.xlsx" | csvformat -l > data/build/ramsey-county--SPPD--police--2017.csv;
in2csv "data/sources/2017 Ramsey County Incidents/2017 VHFD Incidents.xlsx" | csvformat -l > data/build/ramsey-county--VHFD--fire--2017.csv;

# Airport
in2csv "data/sources/Airport Data March 7.xlsx" | csvformat -l > data/build/airport--all--all--2017.csv;

# Anoka county
in2csv "data/sources/Anoka County 911.xlsx" | csvformat -l > data/build/anoka-county--all--all--2017.csv;

# Bloomington
in2csv "data/sources/Bloomington 911 2017 part 1.xlsx" --sheet="Bloomington-StarTribune-Request" | csvformat -l > data/build/bloomington--all--all--2017-01.csv;
in2csv "data/sources/Bloomington 911 2017 part 2.xlsx" | csvformat -l > data/build/bloomington--all--all--2017-02.csv;

# Burnsville
in2csv "data/sources/Burnsville Law 2017 CFS - Redacted.xlsx" | csvformat -l > data/build/burnsville--all--all--2017.csv;

# St Louis Park
in2csv "data/sources/StLouisPark 911 data/CAD Report 010117 thruogh 063017.xls" | csvformat -l > data/build/st-louis-park--all--all--2017-01.csv;
in2csv "data/sources/StLouisPark 911 data/CAD Report 070117 through 123117.xls" | csvformat -l > data/build/st-louis-park--all--all--2017-02.csv;

# Carver county
# Not tabular data with headers
in2csv "data/sources/carver county q1.xls" --no-header-row | csvformat -l > data/build/carver-county--all--all--2017-01.csv;
in2csv "data/sources/carver county q2.xls" --no-header-row | csvformat -l > data/build/carver-county--all--all--2017-02.csv;
in2csv "data/sources/carver county q3.xls" --no-header-row | csvformat -l > data/build/carver-county--all--all--2017-03.csv;
in2csv "data/sources/carver county q4.xls" --no-header-row | csvformat -l > data/build/carver-county--all--all--2017-04.csv;

# Eden Prarie
in2csv "data/sources/Star Tribune Request/April.xlsx" | csvformat -l > data/build/eden-prarie--all--all--2017-04.csv;
in2csv "data/sources/Star Tribune Request/August.xlsx" | csvformat -l > data/build/eden-prarie--all--all--2017-08.csv;
in2csv "data/sources/Star Tribune Request/December.xlsx" | csvformat -l > data/build/eden-prarie--all--all--2017-12.csv;
in2csv "data/sources/Star Tribune Request/February.xlsx" | csvformat -l > data/build/eden-prarie--all--all--2017-02.csv;
in2csv "data/sources/Star Tribune Request/January.xlsx" | csvformat -l > data/build/eden-prarie--all--all--2017-01.csv;
in2csv "data/sources/Star Tribune Request/July.xlsx" | csvformat -l > data/build/eden-prarie--all--all--2017-07.csv;
in2csv "data/sources/Star Tribune Request/June.xlsx" | csvformat -l > data/build/eden-prarie--all--all--2017-06.csv;
in2csv "data/sources/Star Tribune Request/March.xlsx" | csvformat -l > data/build/eden-prarie--all--all--2017-03.csv;
in2csv "data/sources/Star Tribune Request/May.xlsx" | csvformat -l > data/build/eden-prarie--all--all--2017-05.csv;
in2csv "data/sources/Star Tribune Request/November.xlsx" | csvformat -l > data/build/eden-prarie--all--all--2017-11.csv;
in2csv "data/sources/Star Tribune Request/October.xlsx" | csvformat -l > data/build/eden-prarie--all--all--2017-10.csv;
in2csv "data/sources/Star Tribune Request/September.xlsx" | csvformat -l > data/build/eden-prarie--all--all--2017-09.csv;

# Edina and Richfield
in2csv "data/sources/Edina/2018 Star Tribune CAD Request Edina PD FD and Richfield PD FD.xlsx" --sheet="EDINA POLICE" | csvformat -l > data/build/edina--EP--police--2017.csv;
in2csv "data/sources/Edina/2018 Star Tribune CAD Request Edina PD FD and Richfield PD FD.xlsx" --sheet="EDINA FIRE" | csvformat -l > data/build/edina--EF--fire--2017.csv;
in2csv "data/sources/Edina/2018 Star Tribune CAD Request Edina PD FD and Richfield PD FD.xlsx" --sheet="RICHFIELD POLICE" | csvformat -l > data/build/richfield--RP--police--2017.csv;
in2csv "data/sources/Edina/2018 Star Tribune CAD Request Edina PD FD and Richfield PD FD.xlsx" --sheet="RICHFIELD FIRE" | csvformat -l > data/build/richfield--RF--fire--2017.csv;

# Hennepin County
in2csv "data/sources/HennepinSherrif2017911.xlsx" | csvformat -l > data/build/hennepin-county--all--all--2017.csv;

# Minneapolis and UofM
in2csv "data/sources/Minneapolis/911_Calls_Q12017.csv" | csvformat -l > data/build/minneapolis--all--all--2017-01.csv;
in2csv "data/sources/Minneapolis/911_Calls_Q22017.csv" | csvformat -l > data/build/minneapolis--all--all--2017-02.csv;
in2csv "data/sources/Minneapolis/911_Calls_Q32017.csv" | csvformat -l > data/build/minneapolis--all--all--2017-03.csv;
in2csv "data/sources/Minneapolis/911_Calls_Q42017.csv" | csvformat -l > data/build/minneapolis--all--all--2017-04.csv;
in2csv "data/sources/Minneapolis/911_Calls_UofM_2017.csv" | csvformat -l > data/build/u-of-m--all--all--2017.csv;

# Scott County
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="January" | csvformat -l > data/build/scott-county--all--all--2017-01.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="February" | csvformat -l > data/build/scott-county--all--all--2017-02.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="March" | csvformat -l > data/build/scott-county--all--all--2017-03.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="April" | csvformat -l > data/build/scott-county--all--all--2017-04.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="May" | csvformat -l > data/build/scott-county--all--all--2017-05.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="June" | csvformat -l > data/build/scott-county--all--all--2017-06.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="July" | csvformat -l > data/build/scott-county--all--all--2017-07.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="August" | csvformat -l > data/build/scott-county--all--all--2017-08.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="September" | csvformat -l > data/build/scott-county--all--all--2017-09.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="October" | csvformat -l > data/build/scott-county--all--all--2017-10.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="November" | csvformat -l > data/build/scott-county--all--all--2017-11.csv;
in2csv "data/sources/Scott County 911 2017.xlsx" --Sheet="December" | csvformat -l > data/build/scott-county--all--all--2017-12.csv;

# State Patrol
# Weird format
cp data/sources/Metro2017_.txt data/build/minnesota--state-patrol--police--2017.txt;

# Washington County
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 1" | csvformat -l > data/build/washington-county--all--all--2017-01.csv;
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 2" | csvformat -l > data/build/washington-county--all--all--2017-02.csv;
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 3" | csvformat -l > data/build/washington-county--all--all--2017-03.csv;
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 4" | csvformat -l > data/build/washington-county--all--all--2017-04.csv;
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 5" | csvformat -l > data/build/washington-county--all--all--2017-05.csv;
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 6" | csvformat -l > data/build/washington-county--all--all--2017-06.csv;
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 7" | csvformat -l > data/build/washington-county--all--all--2017-07.csv;
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 8" | csvformat -l > data/build/washington-county--all--all--2017-08.csv;
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 9" | csvformat -l > data/build/washington-county--all--all--2017-09.csv;
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 10" | csvformat -l > data/build/washington-county--all--all--2017-10.csv;
in2csv "data/sources/WashCo Star Tribune request.xlsx" --sheet="star053118 11" | csvformat -l > data/build/washington-county--all--all--2017-11.csv;

# White Bear
in2csv "data/sources/White Bear Lake 2017.xlsx" | csvformat -l > data/build/white-bear--all--all--2017.csv
