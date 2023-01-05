#!/bin/bash

RED='\033[0;0;31m'
GREEN='\033[0;0;32m'
NC='\033[0m'

printf \\n
printf "🚀 ${GREEN}Runnig ${1} update.${NC}"
printf \\n

# make sure you are looged in
npm login &&
yarn run lint &&
yarn run test &&
yarn run build &&

if [ $1 == "patch" ]
then
  npm --no-git-tag-version version patch
  echo 1
elif [ $1 == "minor" ]
then
  npm version minor
elif [ $1 == "major" ]
then
  npm version major
else
  printf \\n
  printf "🚀 ${RED}Unexpected version.${NC}"
  printf \\n
  exit 0
fi
