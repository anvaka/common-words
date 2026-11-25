#!/bin/bash
# Stop at the first error, so that a failed build is never pushed.
set -e
rm -rf ./web/dist || exit 0;
cd ./web;
npm run build;
(
cd ./dist
 git init
 git add .
 git commit -m "Deployed to Github Pages"
 git push --force --quiet "git@github.com:anvaka/common-words.git" main:gh-pages
)
