#!/bin/bash

WEBHOOK_URL="http://localhost:3000/api/v1/webhook"

stripe listen --forward-to $WEBHOOK_URL & # MAKE SURE TO INSTALL STRIPE CLI FIRST

cd ..

npm run build && node ./dist/src/main.js