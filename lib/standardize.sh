#!/bin/bash

# Make build directory
mkdir -p build;

# Dakota county
in2csv "source/2017 CFS Dakota County.xlsx" > build/dakota-county--all--all--2017.csv;

# Ramsey county
in2csv "source/2017 Ramsey County Incidents/2017 FHFD Incidents.xlsx" > build/ramsey-county--FHFD--fire--2017.csv;
in2csv "source/2017 Ramsey County Incidents/2017 LCFD Incidents.xlsx" > build/ramsey-county--LCFD--fire--2017.csv;
in2csv "source/2017 Ramsey County Incidents/2017 LJFD Incidents.xlsx" > build/ramsey-county--LJFD--fire--2017.csv;
in2csv "source/2017 Ramsey County Incidents/2017 MAFD Incidents.xlsx" > build/ramsey-county--MAFD--fire--2017.csv;
in2csv "source/2017 Ramsey County Incidents/2017 MAPD Incidents.xlsx" > build/ramsey-county--MAPD--police--2017.csv;
in2csv "source/2017 Ramsey County Incidents/2017 MVPD Incidents.xlsx" > build/ramsey-county--MVPD--police--2017.csv;
in2csv "source/2017 Ramsey County Incidents/2017 NBFD Incidents.xlsx" > build/ramsey-county--NBFD--fire--2017.csv;
in2csv "source/2017 Ramsey County Incidents/2017 NBPD Incidents.xlsx" > build/ramsey-county--NBPD--police--2017.csv;
in2csv "source/2017 Ramsey County Incidents/2017 NSFD Incidents.xlsx" > build/ramsey-county--NSFD--fire--2017.csv;
in2csv "source/2017 Ramsey County Incidents/2017 NSPD Incidents.xlsx" > build/ramsey-county--NSPD--police--2017.csv;
in2csv "source/2017 Ramsey County Incidents/2017 RCSO Incidents.xlsx" > build/ramsey-county--RCSO--sheriff--2017.csv;
in2csv "source/2017 Ramsey County Incidents/2017 RVFD Incidents.xlsx" > build/ramsey-county--RVFD--fire--2017.csv;
in2csv "source/2017 Ramsey County Incidents/2017 RVPD Incidents.xlsx" > build/ramsey-county--RVPD--police--2017.csv;
in2csv "source/2017 Ramsey County Incidents/2017 SAPD Incidents.xlsx" > build/ramsey-county--SAPD--police--2017.csv;
in2csv "source/2017 Ramsey County Incidents/2017 SPFD Incidents.xlsx" > build/ramsey-county--SPFD--fire--2017.csv;
in2csv "source/2017 Ramsey County Incidents/2017 SPPD Incidents.xlsx" > build/ramsey-county--SPPD--police--2017.csv;
in2csv "source/2017 Ramsey County Incidents/2017 VHFD Incidents.xlsx" > build/ramsey-county--VHFD--fire--2017.csv;

# Airport
in2csv "source/Airport Data March 7.xlsx" > build/airport--all--all--2017.csv;

# Anoka county
#in2csv "source/Anoka County 911.xlsx" > build/anoka-county--all--all--2017.csv;
in2csv "source/New AnokaCounty911.xlsx" > build/anoka-county--all--all--2017.csv;

# Bloomington
in2csv "source/Bloomington 911 2017 part 1.xlsx" --sheet="Bloomington-StarTribune-Request" > build/bloomington--all--all--2017-01.csv;
in2csv "source/Bloomington 911 2017 part 2.xlsx" > build/bloomington--all--all--2017-02.csv;

# Burnsville
in2csv "source/Burnsville Law 2017 CFS - Redacted.xlsx" > build/burnsville--all--all--2017.csv;

# St Louis Park
in2csv "source/StLouisPark 911 data/CAD Report 010117 thruogh 063017.xls" > build/st-louis-park--all--all--2017-01.csv;
in2csv "source/StLouisPark 911 data/CAD Report 070117 through 123117.xls" > build/st-louis-park--all--all--2017-02.csv;

# Carver county
# Not tabular data with headers
in2csv "source/carver county q1.xls" --no-header-row > build/carver-county--all--all--2017-01.csv;
in2csv "source/carver county q2.xls" --no-header-row > build/carver-county--all--all--2017-02.csv;
in2csv "source/carver county q3.xls" --no-header-row > build/carver-county--all--all--2017-03.csv;
in2csv "source/carver county q4.xls" --no-header-row > build/carver-county--all--all--2017-04.csv;

# Eden Prarie
in2csv "source/Star Tribune Request/April.xlsx" > build/eden-prarie--all--all--2017-04.csv;
in2csv "source/Star Tribune Request/August.xlsx" > build/eden-prarie--all--all--2017-08.csv;
in2csv "source/Star Tribune Request/December.xlsx" > build/eden-prarie--all--all--2017-12.csv;
in2csv "source/Star Tribune Request/February.xlsx" > build/eden-prarie--all--all--2017-02.csv;
in2csv "source/Star Tribune Request/January.xlsx" > build/eden-prarie--all--all--2017-01.csv;
in2csv "source/Star Tribune Request/July.xlsx" > build/eden-prarie--all--all--2017-07.csv;
in2csv "source/Star Tribune Request/June.xlsx" > build/eden-prarie--all--all--2017-06.csv;
in2csv "source/Star Tribune Request/March.xlsx" > build/eden-prarie--all--all--2017-03.csv;
in2csv "source/Star Tribune Request/May.xlsx" > build/eden-prarie--all--all--2017-05.csv;
in2csv "source/Star Tribune Request/November.xlsx" > build/eden-prarie--all--all--2017-11.csv;
in2csv "source/Star Tribune Request/October.xlsx" > build/eden-prarie--all--all--2017-10.csv;
in2csv "source/Star Tribune Request/September.xlsx" > build/eden-prarie--all--all--2017-09.csv;

# Edina and Richfield
in2csv "source/Edina/2018 Star Tribune CAD Request Edina PD FD and Richfield PD FD.xlsx" --sheet="EDINA POLICE" > build/edina--EP--police--2017.csv;
in2csv "source/Edina/2018 Star Tribune CAD Request Edina PD FD and Richfield PD FD.xlsx" --sheet="EDINA FIRE" > build/edina--EF--fire--2017.csv;
in2csv "source/Edina/2018 Star Tribune CAD Request Edina PD FD and Richfield PD FD.xlsx" --sheet="RICHFIELD POLICE" > build/richfield--RP--police--2017.csv;
in2csv "source/Edina/2018 Star Tribune CAD Request Edina PD FD and Richfield PD FD.xlsx" --sheet="RICHFIELD FIRE" > build/richfield--RF--fire--2017.csv;

# Hennepin County
in2csv "source/HennepinSherrif2017911.xlsx" > build/hennepin-county--all--all--2017.csv;

# Minneapolis and UofM
in2csv "source/Minneapolis/911_Calls_Q12017.csv" > build/minneapolis--all--all--2017-01.csv;
in2csv "source/Minneapolis/911_Calls_Q22017.csv" > build/minneapolis--all--all--2017-02.csv;
in2csv "source/Minneapolis/911_Calls_Q32017.csv" > build/minneapolis--all--all--2017-03.csv;
in2csv "source/Minneapolis/911_Calls_Q42017.csv" > build/minneapolis--all--all--2017-04.csv;
in2csv "source/Minneapolis/911_Calls_UofM_2017.csv" > build/u-of-m--all--all--2017.csv;

# Scott County
in2csv "source/Scott County 911 2017.xlsx" --Sheet="January" > build/scott-county--all--all--2017-01.csv;
in2csv "source/Scott County 911 2017.xlsx" --Sheet="February" > build/scott-county--all--all--2017-02.csv;
in2csv "source/Scott County 911 2017.xlsx" --Sheet="March" > build/scott-county--all--all--2017-03.csv;
in2csv "source/Scott County 911 2017.xlsx" --Sheet="April" > build/scott-county--all--all--2017-04.csv;
in2csv "source/Scott County 911 2017.xlsx" --Sheet="May" > build/scott-county--all--all--2017-05.csv;
in2csv "source/Scott County 911 2017.xlsx" --Sheet="June" > build/scott-county--all--all--2017-06.csv;
in2csv "source/Scott County 911 2017.xlsx" --Sheet="July" > build/scott-county--all--all--2017-07.csv;
in2csv "source/Scott County 911 2017.xlsx" --Sheet="August" > build/scott-county--all--all--2017-08.csv;
in2csv "source/Scott County 911 2017.xlsx" --Sheet="September" > build/scott-county--all--all--2017-09.csv;
in2csv "source/Scott County 911 2017.xlsx" --Sheet="October" > build/scott-county--all--all--2017-10.csv;
in2csv "source/Scott County 911 2017.xlsx" --Sheet="November" > build/scott-county--all--all--2017-11.csv;
in2csv "source/Scott County 911 2017.xlsx" --Sheet="December" > build/scott-county--all--all--2017-12.csv;

# State Patrol
# Weird format
cp source/Metro2017_.txt build/minnesota--state-patrol--police--2017.txt;

# Washington County
in2csv "source/WashCo Star Tribune request.xlsx" --sheet="star053118 1" > build/washington-county--all--all--2017-01.csv;
in2csv "source/WashCo Star Tribune request.xlsx" --sheet="star053118 2" > build/washington-county--all--all--2017-02.csv;
in2csv "source/WashCo Star Tribune request.xlsx" --sheet="star053118 3" > build/washington-county--all--all--2017-03.csv;
in2csv "source/WashCo Star Tribune request.xlsx" --sheet="star053118 4" > build/washington-county--all--all--2017-04.csv;
in2csv "source/WashCo Star Tribune request.xlsx" --sheet="star053118 5" > build/washington-county--all--all--2017-05.csv;
in2csv "source/WashCo Star Tribune request.xlsx" --sheet="star053118 6" > build/washington-county--all--all--2017-06.csv;
in2csv "source/WashCo Star Tribune request.xlsx" --sheet="star053118 7" > build/washington-county--all--all--2017-07.csv;
in2csv "source/WashCo Star Tribune request.xlsx" --sheet="star053118 8" > build/washington-county--all--all--2017-08.csv;
in2csv "source/WashCo Star Tribune request.xlsx" --sheet="star053118 9" > build/washington-county--all--all--2017-09.csv;
in2csv "source/WashCo Star Tribune request.xlsx" --sheet="star053118 10" > build/washington-county--all--all--2017-10.csv;
in2csv "source/WashCo Star Tribune request.xlsx" --sheet="star053118 11" > build/washington-county--all--all--2017-11.csv;

# White Bear
in2csv "source/White Bear Lake 2017.xlsx" > build/white-bear--all--all--2017.csv