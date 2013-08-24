#!/bin/bash
DATE=$(date +"%Y%m%d%H%M")
echo "Copying files to phonegap directory..."
cp -u -v -r source/. my-app/www/ >> logs/build_$DATE.log
echo "Log written to logs/build_$DATE.log"
echo "Zipping file..."

