#!/bin/bash

cd /home/ubuntu/FaceYelp-Client
rm -rf /usr/share/nginx/html/*
cp -r build/. /usr/share/nginx/html/.
service nginx restart
