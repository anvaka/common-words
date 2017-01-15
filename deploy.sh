#!/bin/bash
rm -rf ./web/dist || exit 0;
cd ./web;
npm run build;
(
cd ./dist
 git init
 git add .
 git commit -m "Deployed to Github Pages"
 git push --force --quiet "git@github.com:anvaka/common-words.git" master:gh-pages > /dev/null 2>&1
)
