#!/bin/bash

cd /home/ubuntu/FaceYelp-Client
git reset --hard
git checkout main
git fetch origin
git pull
yarn install
yarn build
