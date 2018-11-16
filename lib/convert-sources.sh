#!/bin/bash
# Assumed to be run from the root of this project
#
# Convert files into CSV in format:
# AREA--AGENCY--TYPE--YEAR/DATE.csv

SOURCES="data/sources";
BUILD="data/build";

# Make build directory
mkdir -p $BUILD;

# Minneapolis and UofM
in2csv "$SOURCES/Minneapolis/NEW911Calls2017_Q1.csv" | csvformat -l > $BUILD/minneapolis--all--all--2017-01.csv;
in2csv "$SOURCES/Minneapolis/New911Calls2017_Q2.csv" | csvformat -l > $BUILD/minneapolis--all--all--2017-02.csv;
in2csv "$SOURCES/Minneapolis/New911Calls2017_Q3.csv" | csvformat -l > $BUILD/minneapolis--all--all--2017-03.csv;
in2csv "$SOURCES/Minneapolis/New911Calls2017_Q4.csv" | csvformat -l > $BUILD/minneapolis--all--all--2017-04.csv;
#in2csv "$SOURCES/Minneapolis/911_Calls_UofM_2017.csv" | csvformat -l > data/build/u-of-m--all--all--2017.csv;

# St. Paul
in2csv "$SOURCES/St. Paul/2017 SPFD IncidentsWPriorityDispo_Unredacted.xlsx" | csvformat -l > $BUILD/st-paul--spfd--fire--2017-01.csv;
in2csv "$SOURCES/St. Paul/2017 SPPD IncidentsWPriorityDispo.xlsx" | csvformat -l > $BUILD/st-paul--sppd--police--2017-01.csv;


