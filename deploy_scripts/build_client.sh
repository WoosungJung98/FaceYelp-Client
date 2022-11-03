#!/bin/bash

cd /home/ec2-user/FaceYelp-Client
git reset --hard
git checkout main
git fetch origin
git pull
yarn install
yarn build
