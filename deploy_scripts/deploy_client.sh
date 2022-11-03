#!/bin/bash

cd /home/ec2-user/FaceYelp-Client
rm -rf /usr/share/nginx/html/*
cp -r build/. /usr/share/nginx/html/.
service nginx restart
