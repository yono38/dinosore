#!/bin/bash
echo "Pushing to git..."
git push origin master
echo "Pushing to jasonschapiro.com..."
scp -r source/ root@jasonschapiro.com:/var/www/InternalProjects/dinosore/
DATE=$(date +"%Y%m%d%H%M")
echo "Copying files to phonegap directory..."
cp -u -v -r source/. my-app/www/ >> logs/build_$DATE.log
echo "File copy successful, log written to logs/build_$DATE.log"
echo "Zipping file..."
zip -r my-app my-app
echo "File zipped successfully"
echo "Running node script..."
node deploy.js
